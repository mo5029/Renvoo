import fs from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  addBudget,
  addExpense,
  addMonthsClamped,
  addSubscription,
  calculateVatBreakdown,
  financePaths,
  formatMoney,
  generateMonthReport,
  getFinanceSummary,
  parseMoneyToMinor,
  readEntries,
} from "../src/dashboard/finance-data.js";
import { getLegalDatabases, getOutreachDatabases, parseCsv } from "../src/dashboard/database-adapters.js";
import { createDashboardServer } from "../src/dashboard/server.js";

let rootDir: string;

beforeEach(async () => {
  rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "renvoo-dashboard-"));
  await fs.mkdir(path.join(rootDir, "docs", "outreach"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "docs", "legal", "privacy"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "memory", "wiki", "topics"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "memory", "wiki", "entities"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "memory", "wiki", "decisions"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "memory", "wiki", "sources"), { recursive: true });
  await fs.mkdir(path.join(rootDir, "memory", "wiki", "queries"), { recursive: true });
  await fs.writeFile(path.join(rootDir, ".gitignore"), "memory/private/finance/\n", "utf8");
});

afterEach(async () => {
  await fs.rm(rootDir, { recursive: true, force: true });
});

describe("dashboard finance data layer", () => {
  it("keeps money in minor units and validates VAT rounding", () => {
    expect(parseMoneyToMinor("71.67")).toBe(7167);
    expect(formatMoney(7167)).toBe("71.67 EUR");
    expect(() => parseMoneyToMinor("1.999")).toThrow(/more than 2 decimal/);
    expect(
      calculateVatBreakdown({ amountMinor: 999, currency: "EUR", rateBps: 2100, mode: "gross" }),
    ).toMatchObject({ netAmountMinor: 826, vatAmountMinor: 173, grossAmountMinor: 999 });
  });

  it("adds balanced expenses and month budgets from private files", async () => {
    await addExpense(rootDir, {
      date: "2026-04-24",
      amount: "71.67",
      vendor: "Codex",
      expenseAccountCode: "6100",
      paymentAccountCode: "1000",
      vatRateBps: 0,
    });
    await addBudget(rootDir, { month: "2026-04", category: "software", amount: "100.00" });

    const [entry] = await readEntries(rootDir);
    const debit = entry.lines.filter((line) => line.side === "debit").reduce((sum, line) => sum + line.amountMinor, 0);
    const credit = entry.lines.filter((line) => line.side === "credit").reduce((sum, line) => sum + line.amountMinor, 0);
    const summary = await getFinanceSummary(rootDir, "2026-04");

    expect(debit).toBe(credit);
    expect(summary.totals.monthExpenseMinor).toBe(7167);
    expect(summary.budgets[0]).toMatchObject({ spentMinor: 7167, remainingMinor: 2833 });
  });

  it("forecasts month-end recurring discounts and step-ups", async () => {
    await addSubscription(rootDir, {
      name: "Month End Tool",
      vendor: "Vendor",
      startDate: "2026-01-31",
      amount: "10.00",
      regularAmount: "15.00",
      discountType: "fixed",
      discountValue: "5.00",
      discountPeriods: 3,
    });

    expect(addMonthsClamped("2026-01-31", 1, 31)).toBe("2026-02-28");
    const summary = await getFinanceSummary(rootDir, "2026-01");
    expect(summary.upcoming.slice(0, 3).map((item) => [item.chargeDate, item.grossAmountMinor, item.stepUpAmountMinor])).toEqual([
      ["2026-01-31", 1000, 500],
      ["2026-02-28", 1000, 500],
      ["2026-03-31", 1000, 500],
    ]);
  });

  it("keeps vendor details out of aggregate public report preview", async () => {
    await addExpense(rootDir, {
      date: "2026-04-24",
      amount: "71.67",
      vendor: "Secret Vendor",
      receiptPath: "/private/receipt.pdf",
      notes: "sensitive notes",
      expenseAccountCode: "6100",
    });

    const report = await generateMonthReport(rootDir, "2026-04");
    expect(report.privateReport).toContain("Secret Vendor");
    expect(JSON.stringify(report.publicSummaryPreview)).not.toContain("Secret Vendor");
    expect(JSON.stringify(report.publicSummaryPreview)).not.toContain("receipt.pdf");
    expect(JSON.stringify(report.publicSummaryPreview)).not.toContain("sensitive notes");
  });
});

describe("dashboard database adapters", () => {
  it("parses CSV, outreach, and legal databases", async () => {
    await fs.writeFile(
      path.join(rootDir, "docs", "outreach", "tracker.csv"),
      "status,next_action_date,name\nsent,2026-04-25,A\nqueued,,B\n",
      "utf8",
    );
    await fs.writeFile(path.join(rootDir, "docs", "legal", "privacy", "register.md"), "# Processor Register\n\nUpdated 2026-04-24\n", "utf8");

    expect(parseCsv("a,b\n\"x,y\",z\n")).toEqual([
      ["a", "b"],
      ["x,y", "z"],
    ]);
    const outreach = await getOutreachDatabases(rootDir);
    const legal = await getLegalDatabases(rootDir);

    expect(outreach[0]).toMatchObject({ rows: 2, statusCounts: { sent: 1, queued: 1 }, nextActionCount: 1 });
    expect(legal[0]).toMatchObject({ title: "Processor Register", section: "privacy" });
  });
});

describe("dashboard API", () => {
  async function withServer(test: (baseUrl: string) => Promise<void>): Promise<void> {
    const server = createDashboardServer({ rootDir }) as http.Server;
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Server did not bind to a TCP port.");
    try {
      await test(`http://127.0.0.1:${address.port}`);
    } finally {
      await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
  }

  it("adds expenses through the private API and writes only under private finance", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/finance/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: "2026-04-24", amount: "71.67", vendor: "Codex", expenseAccountCode: "6100" }),
      });
      expect(response.status).toBe(201);
      const summaryResponse = await fetch(`${baseUrl}/api/dashboard/summary?month=2026-04`);
      const summary = await summaryResponse.json();
      const paths = financePaths(rootDir);

      expect(summary.finance.totals.monthExpenseMinor).toBe(7167);
      expect(await fs.readFile(paths.entriesPath, "utf8")).toContain("Codex");
    });
  });
});
