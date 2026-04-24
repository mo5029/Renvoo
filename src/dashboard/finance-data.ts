import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";
export type JournalSide = "debit" | "credit";
export type VatMode = "gross" | "net";
export type BillingCadence = "monthly" | "yearly";

export interface Account {
  code: string;
  name: string;
  type: AccountType;
  normalSide: JournalSide;
  publicCategory: string;
}

export interface JournalLine {
  accountCode: string;
  side: JournalSide;
  amountMinor: number;
  currency: string;
  memo?: string;
}

export interface VatBreakdown {
  mode: VatMode;
  rateBps: number;
  netAmountMinor: number;
  vatAmountMinor: number;
  grossAmountMinor: number;
  currency: string;
  jurisdiction: string;
  vatCategory: string;
  supplierVatId?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  createdAt: string;
  description: string;
  status: "posted" | "imported" | "reversal" | "voided";
  source?: { type: "manual" | "expense" | "recurring" | "import" | "reversal"; id?: string };
  vendor?: string;
  counterparty?: string;
  receiptPath?: string;
  notes?: string;
  reportingCurrency?: string;
  reportingAmountMinor?: number;
  vat?: VatBreakdown;
  lines: JournalLine[];
}

export interface RecurringSubscription {
  id: string;
  name: string;
  vendor: string;
  startDate: string;
  cadence: BillingCadence;
  anchorDay: number;
  amountMinor: number;
  regularAmountMinor: number;
  currency: string;
  vatRateBps: number;
  vatMode: VatMode;
  expenseAccountCode: string;
  paymentAccountCode: string;
  discount?: {
    type: "fixed" | "percent";
    valueMinor?: number;
    percentBps?: number;
    periods: number;
  };
  termMonths?: number;
  renewalDate?: string;
  cancellationDeadline?: string;
  notes?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  month: string;
  category: string;
  amountMinor: number;
  currency: string;
  notes?: string;
  createdAt: string;
}

export interface FinancePaths {
  dir: string;
  ledgerDir: string;
  entriesPath: string;
  recurringDir: string;
  subscriptionsPath: string;
  budgetsPath: string;
  receiptsDir: string;
  reportsDir: string;
  auditDir: string;
  auditEventsPath: string;
  chartPath: string;
}

export interface ForecastCharge {
  subscriptionId: string;
  subscriptionName: string;
  vendor: string;
  chargeDate: string;
  currency: string;
  grossAmountMinor: number;
  netAmountMinor: number;
  vatAmountMinor: number;
  regularGrossAmountMinor: number;
  stepUpAmountMinor: number;
  discountAmountMinor: number;
  discountEndsOn?: string;
  cancellationDeadline?: string;
  renewalDate?: string;
}

const DEFAULT_CURRENCY = "EUR";
const VAT_RECEIVABLE_ACCOUNT = "1100";

export const STARTER_CHART: Account[] = [
  { code: "1000", name: "Bank / Cash", type: "asset", normalSide: "debit", publicCategory: "cash" },
  { code: "1100", name: "VAT Receivable", type: "asset", normalSide: "debit", publicCategory: "tax" },
  { code: "1999", name: "Unreconciled Imports", type: "asset", normalSide: "debit", publicCategory: "unreconciled" },
  { code: "2000", name: "Credit Card / Payable", type: "liability", normalSide: "credit", publicCategory: "payables" },
  { code: "3000", name: "Founder Capital", type: "equity", normalSide: "credit", publicCategory: "funding" },
  { code: "4000", name: "Revenue", type: "revenue", normalSide: "credit", publicCategory: "revenue" },
  { code: "6100", name: "Software Subscriptions", type: "expense", normalSide: "debit", publicCategory: "software" },
  { code: "6200", name: "Infrastructure", type: "expense", normalSide: "debit", publicCategory: "infrastructure" },
  { code: "6300", name: "Legal & Compliance", type: "expense", normalSide: "debit", publicCategory: "legal-compliance" },
  { code: "6400", name: "Marketing & Outreach", type: "expense", normalSide: "debit", publicCategory: "marketing-outreach" },
  { code: "6500", name: "Events & Travel", type: "expense", normalSide: "debit", publicCategory: "events-travel" },
  { code: "6990", name: "Misc Operating Expenses", type: "expense", normalSide: "debit", publicCategory: "misc-operations" },
];

export function financePaths(rootDir: string): FinancePaths {
  const dir = path.join(rootDir, "memory", "private", "finance");
  return {
    dir,
    ledgerDir: path.join(dir, "ledger"),
    entriesPath: path.join(dir, "ledger", "entries.jsonl"),
    recurringDir: path.join(dir, "recurring"),
    subscriptionsPath: path.join(dir, "recurring", "subscriptions.json"),
    budgetsPath: path.join(dir, "budgets.json"),
    receiptsDir: path.join(dir, "receipts"),
    reportsDir: path.join(dir, "reports"),
    auditDir: path.join(dir, "audit"),
    auditEventsPath: path.join(dir, "audit", "events.jsonl"),
    chartPath: path.join(dir, "chart-of-accounts.json"),
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

function idFor(seed: string): string {
  return crypto.createHash("sha1").update(seed).digest("hex").slice(0, 16);
}

function normalizeCurrency(currency = DEFAULT_CURRENCY): string {
  return currency.trim().toUpperCase();
}

function assertSafeMinor(value: number, label: string): void {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${label} must be a safe integer minor-unit amount.`);
  }
}

function roundDiv(numerator: number, denominator: number): number {
  const quotient = Math.trunc(numerator / denominator);
  const remainder = Math.abs(numerator % denominator);
  return remainder * 2 >= denominator ? quotient + Math.sign(numerator || 1) : quotient;
}

function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid date: ${value}`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid calendar date: ${value}`);
  }
  return date;
}

function monthStart(month: string): string {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error(`Invalid month: ${month}`);
  }
  return `${month}-01`;
}

function lastDayOfMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export function addMonthsClamped(startDate: string, monthsToAdd: number, anchorDay?: number): string {
  const start = parseDate(startDate);
  const anchor = anchorDay ?? start.getUTCDate();
  const baseMonth = start.getUTCMonth() + monthsToAdd;
  const targetYear = start.getUTCFullYear() + Math.floor(baseMonth / 12);
  const targetMonth = ((baseMonth % 12) + 12) % 12;
  const day = Math.min(anchor, lastDayOfMonth(targetYear, targetMonth));
  return new Date(Date.UTC(targetYear, targetMonth, day)).toISOString().slice(0, 10);
}

export function parseMoneyToMinor(value: string, currency = DEFAULT_CURRENCY, allowNegative = false): number {
  const normalized = normalizeCurrency(currency);
  const scale = normalized === "JPY" ? 0 : 2;
  const cleaned = String(value).trim();
  const sign = cleaned.startsWith("-") ? -1 : 1;
  const unsigned = cleaned.replace(/^[+-]/, "");

  if (sign < 0 && !allowNegative) {
    throw new Error("Negative amounts are not allowed here.");
  }
  if (!/^\d+(\.\d+)?$/.test(unsigned)) {
    throw new Error(`Invalid money amount: ${value}`);
  }

  const [whole, fraction = ""] = unsigned.split(".");
  if (fraction.length > scale) {
    throw new Error(`${normalized} amount cannot have more than ${scale} decimal places.`);
  }

  const minor = Number.parseInt(whole, 10) * 10 ** scale + Number.parseInt(fraction.padEnd(scale, "0") || "0", 10);
  assertSafeMinor(minor, "Money amount");
  return minor * sign;
}

export function formatMoney(minor: number, currency = DEFAULT_CURRENCY): string {
  const normalized = normalizeCurrency(currency);
  const scale = normalized === "JPY" ? 0 : 2;
  const sign = minor < 0 ? "-" : "";
  const absolute = Math.abs(minor);
  if (scale === 0) return `${sign}${absolute} ${normalized}`;
  return `${sign}${Math.trunc(absolute / 100)}.${String(absolute % 100).padStart(2, "0")} ${normalized}`;
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function writeIfMissing(filePath: string, content: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    await ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, "utf8");
  }
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function appendJsonl(filePath: string, value: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.appendFile(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

async function readJsonl<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return raw.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line) as T);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function ensureFinanceStore(rootDir: string): Promise<FinancePaths> {
  const paths = financePaths(rootDir);
  await Promise.all([
    ensureDir(paths.ledgerDir),
    ensureDir(paths.recurringDir),
    ensureDir(paths.receiptsDir),
    ensureDir(paths.reportsDir),
    ensureDir(paths.auditDir),
  ]);
  await writeIfMissing(paths.entriesPath, "");
  await writeIfMissing(paths.subscriptionsPath, "[]\n");
  await writeIfMissing(paths.budgetsPath, "[]\n");
  await writeIfMissing(paths.auditEventsPath, "");
  await writeIfMissing(paths.chartPath, `${JSON.stringify(STARTER_CHART, null, 2)}\n`);
  return paths;
}

export async function readAccounts(rootDir: string): Promise<Account[]> {
  const paths = await ensureFinanceStore(rootDir);
  return readJson<Account[]>(paths.chartPath, STARTER_CHART);
}

export async function readEntries(rootDir: string): Promise<JournalEntry[]> {
  const paths = await ensureFinanceStore(rootDir);
  return readJsonl<JournalEntry>(paths.entriesPath);
}

export async function readSubscriptions(rootDir: string): Promise<RecurringSubscription[]> {
  const paths = await ensureFinanceStore(rootDir);
  return readJson<RecurringSubscription[]>(paths.subscriptionsPath, []);
}

export async function readBudgets(rootDir: string): Promise<Budget[]> {
  const paths = await ensureFinanceStore(rootDir);
  return readJson<Budget[]>(paths.budgetsPath, []);
}

function accountMap(accounts: Account[]): Map<string, Account> {
  return new Map(accounts.map((account) => [account.code, account]));
}

export function validateJournalEntry(entry: JournalEntry, accounts = STARTER_CHART): void {
  if (!entry.id || !entry.date || !entry.lines.length) throw new Error("Journal entry is incomplete.");
  parseDate(entry.date);
  if (entry.lines.length < 2) throw new Error("Journal entry must contain at least two lines.");

  const codes = new Set(accounts.map((account) => account.code));
  const totals = new Map<string, { debit: number; credit: number }>();
  let debitCount = 0;
  let creditCount = 0;

  for (const line of entry.lines) {
    if (!codes.has(line.accountCode)) throw new Error(`Unknown account: ${line.accountCode}`);
    if (line.side !== "debit" && line.side !== "credit") throw new Error(`Invalid side: ${line.side}`);
    assertSafeMinor(line.amountMinor, "Journal line amount");
    if (line.amountMinor <= 0) throw new Error("Journal line amounts must be positive.");
    const currency = normalizeCurrency(line.currency);
    const total = totals.get(currency) ?? { debit: 0, credit: 0 };
    total[line.side] += line.amountMinor;
    totals.set(currency, total);
    if (line.side === "debit") debitCount += 1;
    if (line.side === "credit") creditCount += 1;
  }

  if (!debitCount || !creditCount) throw new Error("Journal entry must contain debits and credits.");
  for (const [currency, total] of totals) {
    if (total.debit !== total.credit) {
      throw new Error(`Journal entry does not balance for ${currency}.`);
    }
  }
}

export function calculateVatBreakdown(input: {
  amountMinor: number;
  currency: string;
  rateBps: number;
  mode: VatMode;
  jurisdiction?: string;
  vatCategory?: string;
  supplierVatId?: string;
}): VatBreakdown {
  assertSafeMinor(input.amountMinor, "VAT amount");
  if (input.amountMinor < 0 || input.rateBps < 0 || !Number.isInteger(input.rateBps)) {
    throw new Error("Invalid VAT input.");
  }

  const netAmountMinor =
    input.mode === "net"
      ? input.amountMinor
      : input.amountMinor - roundDiv(input.amountMinor * input.rateBps, 10000 + input.rateBps);
  const vatAmountMinor =
    input.mode === "net"
      ? roundDiv(input.amountMinor * input.rateBps, 10000)
      : input.amountMinor - netAmountMinor;
  const grossAmountMinor = input.mode === "net" ? input.amountMinor + vatAmountMinor : input.amountMinor;

  return {
    mode: input.mode,
    rateBps: input.rateBps,
    netAmountMinor,
    vatAmountMinor,
    grossAmountMinor,
    currency: normalizeCurrency(input.currency),
    jurisdiction: input.jurisdiction ?? "NL",
    vatCategory: input.vatCategory ?? (input.rateBps ? "standard" : "unknown"),
    supplierVatId: input.supplierVatId,
  };
}

export async function appendEntry(rootDir: string, entry: JournalEntry): Promise<JournalEntry> {
  const paths = await ensureFinanceStore(rootDir);
  const accounts = await readAccounts(rootDir);
  validateJournalEntry(entry, accounts);
  const existing = await readEntries(rootDir);
  if (existing.some((item) => item.id === entry.id)) throw new Error(`Duplicate entry id: ${entry.id}`);
  await appendJsonl(paths.entriesPath, entry);
  await appendJsonl(paths.auditEventsPath, {
    type: "journal-entry-created",
    createdAt: nowIso(),
    payload: { id: entry.id, date: entry.date, status: entry.status, source: entry.source },
  });
  return entry;
}

export async function addExpense(rootDir: string, input: {
  date: string;
  amount: string;
  currency?: string;
  vendor: string;
  expenseAccountCode?: string;
  paymentAccountCode?: string;
  vatRateBps?: number;
  vatMode?: VatMode;
  receiptPath?: string;
  notes?: string;
}): Promise<JournalEntry> {
  const currency = normalizeCurrency(input.currency);
  const amountMinor = parseMoneyToMinor(input.amount, currency);
  const vat = calculateVatBreakdown({
    amountMinor,
    currency,
    rateBps: input.vatRateBps ?? 0,
    mode: input.vatMode ?? "gross",
  });
  const createdAt = nowIso();
  const expenseAccountCode = input.expenseAccountCode ?? "6990";
  const paymentAccountCode = input.paymentAccountCode ?? "1000";
  const lines: JournalLine[] = [
    { accountCode: expenseAccountCode, side: "debit", amountMinor: vat.netAmountMinor, currency, memo: "Expense net amount" },
  ];
  if (vat.vatAmountMinor > 0) {
    lines.push({ accountCode: VAT_RECEIVABLE_ACCOUNT, side: "debit", amountMinor: vat.vatAmountMinor, currency, memo: "VAT receivable" });
  }
  lines.push({ accountCode: paymentAccountCode, side: "credit", amountMinor: vat.grossAmountMinor, currency, memo: "Payment account" });

  return appendEntry(rootDir, {
    id: idFor(`expense:${input.date}:${input.vendor}:${amountMinor}:${createdAt}`),
    date: input.date,
    createdAt,
    description: `Expense: ${input.vendor}`,
    status: "posted",
    source: { type: "expense" },
    vendor: input.vendor,
    receiptPath: input.receiptPath,
    notes: input.notes,
    reportingCurrency: DEFAULT_CURRENCY,
    reportingAmountMinor: currency === DEFAULT_CURRENCY ? vat.grossAmountMinor : undefined,
    vat,
    lines,
  });
}

export async function addSubscription(rootDir: string, input: {
  name: string;
  vendor: string;
  startDate: string;
  cadence?: BillingCadence;
  amount: string;
  regularAmount?: string;
  currency?: string;
  vatRateBps?: number;
  vatMode?: VatMode;
  expenseAccountCode?: string;
  paymentAccountCode?: string;
  discountType?: "fixed" | "percent";
  discountValue?: string | number;
  discountPeriods?: number;
  termMonths?: number;
  renewalDate?: string;
  cancellationDeadline?: string;
  notes?: string;
}): Promise<RecurringSubscription> {
  const paths = await ensureFinanceStore(rootDir);
  const currency = normalizeCurrency(input.currency);
  const start = parseDate(input.startDate);
  const createdAt = nowIso();
  const discount =
    input.discountType && input.discountValue !== undefined
      ? input.discountType === "fixed"
        ? { type: "fixed" as const, valueMinor: parseMoneyToMinor(String(input.discountValue), currency), periods: input.discountPeriods ?? 1 }
        : { type: "percent" as const, percentBps: Number(input.discountValue), periods: input.discountPeriods ?? 1 }
      : undefined;

  const subscription: RecurringSubscription = {
    id: idFor(`subscription:${input.vendor}:${input.name}:${input.startDate}:${createdAt}`),
    name: input.name,
    vendor: input.vendor,
    startDate: input.startDate,
    cadence: input.cadence ?? "monthly",
    anchorDay: start.getUTCDate(),
    amountMinor: parseMoneyToMinor(input.amount, currency),
    regularAmountMinor: parseMoneyToMinor(input.regularAmount ?? input.amount, currency),
    currency,
    vatRateBps: input.vatRateBps ?? 0,
    vatMode: input.vatMode ?? "gross",
    expenseAccountCode: input.expenseAccountCode ?? "6100",
    paymentAccountCode: input.paymentAccountCode ?? "1000",
    discount,
    termMonths: input.termMonths,
    renewalDate: input.renewalDate,
    cancellationDeadline: input.cancellationDeadline,
    notes: input.notes,
    createdAt,
  };

  const subscriptions = await readSubscriptions(rootDir);
  await writeJson(paths.subscriptionsPath, [...subscriptions, subscription]);
  await appendJsonl(paths.auditEventsPath, { type: "subscription-created", createdAt, payload: { id: subscription.id } });
  return subscription;
}

export async function addBudget(rootDir: string, input: {
  month: string;
  category: string;
  amount: string;
  currency?: string;
  notes?: string;
}): Promise<Budget> {
  const paths = await ensureFinanceStore(rootDir);
  const createdAt = nowIso();
  const budget: Budget = {
    id: idFor(`budget:${input.month}:${input.category}:${createdAt}`),
    month: input.month,
    category: input.category,
    amountMinor: parseMoneyToMinor(input.amount, input.currency ?? DEFAULT_CURRENCY),
    currency: normalizeCurrency(input.currency),
    notes: input.notes,
    createdAt,
  };
  const budgets = await readBudgets(rootDir);
  await writeJson(paths.budgetsPath, [...budgets, budget]);
  await appendJsonl(paths.auditEventsPath, { type: "budget-created", createdAt, payload: { id: budget.id } });
  return budget;
}

function discountAmount(subscription: RecurringSubscription, periodIndex: number): number {
  const discount = subscription.discount;
  if (!discount || periodIndex >= discount.periods) return 0;
  if (discount.type === "fixed") return discount.valueMinor ?? 0;
  return roundDiv(subscription.regularAmountMinor * (discount.percentBps ?? 0), 10000);
}

function monthsBetween(startDate: string, endDate: string): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());
}

export function forecastSubscription(subscription: RecurringSubscription, fromDate: string, months: number): ForecastCharge[] {
  const firstCandidate = Math.max(0, monthsBetween(subscription.startDate, fromDate) - 1);
  const endDate = addMonthsClamped(fromDate, months, parseDate(fromDate).getUTCDate());
  const charges: ForecastCharge[] = [];

  for (let periodIndex = firstCandidate; periodIndex < firstCandidate + months + 24; periodIndex += 1) {
    const chargeDate = addMonthsClamped(subscription.startDate, subscription.cadence === "yearly" ? periodIndex * 12 : periodIndex, subscription.anchorDay);
    if (chargeDate < fromDate) continue;
    if (chargeDate >= endDate) break;
    if (subscription.termMonths && chargeDate >= addMonthsClamped(subscription.startDate, subscription.termMonths, subscription.anchorDay)) break;

    const discountMinor = discountAmount(subscription, periodIndex);
    const baseAmount = Math.max(0, subscription.regularAmountMinor - discountMinor);
    const vat = calculateVatBreakdown({ amountMinor: baseAmount, currency: subscription.currency, rateBps: subscription.vatRateBps, mode: subscription.vatMode });
    const regularVat = calculateVatBreakdown({ amountMinor: subscription.regularAmountMinor, currency: subscription.currency, rateBps: subscription.vatRateBps, mode: subscription.vatMode });
    charges.push({
      subscriptionId: subscription.id,
      subscriptionName: subscription.name,
      vendor: subscription.vendor,
      chargeDate,
      currency: subscription.currency,
      grossAmountMinor: vat.grossAmountMinor,
      netAmountMinor: vat.netAmountMinor,
      vatAmountMinor: vat.vatAmountMinor,
      regularGrossAmountMinor: regularVat.grossAmountMinor,
      stepUpAmountMinor: regularVat.grossAmountMinor - vat.grossAmountMinor,
      discountAmountMinor: discountMinor,
      discountEndsOn: discountMinor > 0 ? addMonthsClamped(subscription.startDate, subscription.discount?.periods ?? 0, subscription.anchorDay) : undefined,
      cancellationDeadline: subscription.cancellationDeadline,
      renewalDate: subscription.renewalDate,
    });
  }

  return charges;
}

export async function forecastSubscriptions(rootDir: string, fromDate: string, months: number): Promise<ForecastCharge[]> {
  const subscriptions = await readSubscriptions(rootDir);
  return subscriptions.flatMap((item) => forecastSubscription(item, fromDate, months)).sort((a, b) => a.chargeDate.localeCompare(b.chargeDate));
}

function amountForLine(entry: JournalEntry, line: JournalLine): number {
  if (normalizeCurrency(line.currency) === DEFAULT_CURRENCY) return line.amountMinor;
  if (!entry.reportingAmountMinor || !entry.vat?.grossAmountMinor) return 0;
  return roundDiv(entry.reportingAmountMinor * line.amountMinor, entry.vat.grossAmountMinor);
}

export async function getFinanceSummary(rootDir: string, month = new Date().toISOString().slice(0, 7)): Promise<{
  month: string;
  accounts: Account[];
  entries: JournalEntry[];
  subscriptions: RecurringSubscription[];
  budgets: Array<Budget & { spentMinor: number; remainingMinor: number; percentUsed: number }>;
  upcoming: ForecastCharge[];
  totals: {
    allTimeExpenseMinor: number;
    monthExpenseMinor: number;
    vatRecoverableMinor: number;
    unreconciledCount: number;
    upcomingMinor: number;
    stepUpExposureMinor: number;
  };
  categoryTotals: Array<{ category: string; amountMinor: number; currency: string }>;
}> {
  const [accounts, entries, subscriptions, budgets] = await Promise.all([
    readAccounts(rootDir),
    readEntries(rootDir),
    readSubscriptions(rootDir),
    readBudgets(rootDir),
  ]);
  const accountsByCode = accountMap(accounts);
  const categoryTotals = new Map<string, number>();
  let allTimeExpenseMinor = 0;
  let monthExpenseMinor = 0;
  let vatRecoverableMinor = 0;
  let unreconciledCount = 0;
  const start = monthStart(month);
  const end = addMonthsClamped(start, 1, 1);

  for (const entry of entries.filter((item) => item.status !== "voided")) {
    if (entry.status === "imported") unreconciledCount += 1;
    for (const line of entry.lines) {
      const account = accountsByCode.get(line.accountCode);
      if (!account) continue;
      const signed = line.side === account.normalSide ? amountForLine(entry, line) : -amountForLine(entry, line);
      if (account.type === "expense") {
        allTimeExpenseMinor += signed;
        if (entry.date >= start && entry.date < end) {
          monthExpenseMinor += signed;
          categoryTotals.set(account.publicCategory, (categoryTotals.get(account.publicCategory) ?? 0) + signed);
        }
      }
      if (line.accountCode === VAT_RECEIVABLE_ACCOUNT && entry.date >= start && entry.date < end) {
        vatRecoverableMinor += line.side === "debit" ? amountForLine(entry, line) : -amountForLine(entry, line);
      }
    }
  }

  const upcoming = await forecastSubscriptions(rootDir, start, 3);
  const upcomingMinor = upcoming.reduce((sum, item) => sum + (item.currency === DEFAULT_CURRENCY ? item.grossAmountMinor : 0), 0);
  const stepUpExposureMinor = upcoming.reduce((sum, item) => sum + (item.currency === DEFAULT_CURRENCY ? item.stepUpAmountMinor : 0), 0);

  const budgetRows = budgets
    .filter((budget) => budget.month === month)
    .map((budget) => {
      const spentMinor = categoryTotals.get(budget.category) ?? 0;
      return {
        ...budget,
        spentMinor,
        remainingMinor: budget.amountMinor - spentMinor,
        percentUsed: budget.amountMinor > 0 ? Math.round((spentMinor / budget.amountMinor) * 100) : 0,
      };
    });

  return {
    month,
    accounts,
    entries,
    subscriptions,
    budgets: budgetRows,
    upcoming,
    totals: {
      allTimeExpenseMinor,
      monthExpenseMinor,
      vatRecoverableMinor,
      unreconciledCount,
      upcomingMinor,
      stepUpExposureMinor,
    },
    categoryTotals: Array.from(categoryTotals.entries()).map(([category, amountMinor]) => ({ category, amountMinor, currency: DEFAULT_CURRENCY })),
  };
}

export async function generateMonthReport(rootDir: string, month: string): Promise<{ privateReport: string; publicSummaryPreview: Record<string, unknown> }> {
  const summary = await getFinanceSummary(rootDir, month);
  const paths = await ensureFinanceStore(rootDir);
  const privateReport = [
    `# Renvoo Private Finance Report: ${month}`,
    "",
    `Generated at: ${nowIso()}`,
    "",
    "## Expense Totals",
    "",
    ...(summary.categoryTotals.length ? summary.categoryTotals.map((item) => `- ${item.category}: ${formatMoney(item.amountMinor, item.currency)}`) : ["- No expenses recorded."]),
    "",
    "## Entries",
    "",
    ...(summary.entries.filter((entry) => entry.date.startsWith(month)).map((entry) => `- ${entry.date} | ${entry.id} | ${entry.description}${entry.vendor ? ` | vendor: ${entry.vendor}` : ""}`)),
    "",
  ].join("\n");
  await fs.writeFile(path.join(paths.reportsDir, `month-${month}.md`), privateReport, "utf8");

  return {
    privateReport,
    publicSummaryPreview: {
      month,
      totalExpenseMinor: summary.totals.monthExpenseMinor,
      categoryTotals: summary.categoryTotals,
      upcomingRecurringObligationsMinor: summary.totals.upcomingMinor,
      upcomingStepUpsMinor: summary.totals.stepUpExposureMinor,
    },
  };
}
