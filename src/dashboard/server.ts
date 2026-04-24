import http, { type IncomingMessage, type ServerResponse } from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import {
  addBudget,
  addExpense,
  addSubscription,
  ensureFinanceStore,
  formatMoney,
  generateMonthReport,
  getFinanceSummary,
  readBudgets,
  readEntries,
  readSubscriptions,
} from "./finance-data.js";
import {
  getLegalDatabases,
  getMemoryDatabases,
  getOutreachDatabases,
} from "./database-adapters.js";

const dashboardDir = path.dirname(fileURLToPath(import.meta.url));
const defaultPublicDir = path.join(dashboardDir, "public");

export interface DashboardServerOptions {
  rootDir?: string;
  publicDir?: string;
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function sendText(response: ServerResponse, status: number, text: string, contentType = "text/plain; charset=utf-8"): void {
  response.writeHead(status, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  response.end(text);
}

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  return "application/octet-stream";
}

async function readBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    if (Buffer.concat(chunks).byteLength > 1_000_000) {
      throw new Error("Request body is too large.");
    }
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

function requireString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }
  return value.trim();
}

function optionalString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNumber(payload: Record<string, unknown>, key: string): number | undefined {
  const value = payload[key];
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${key} must be numeric.`);
  return parsed;
}

async function handleApi(rootDir: string, request: IncomingMessage, response: ServerResponse, url: URL): Promise<void> {
  if (request.method === "GET" && url.pathname === "/api/dashboard/summary") {
    const month = url.searchParams.get("month") ?? new Date().toISOString().slice(0, 7);
    const finance = await getFinanceSummary(rootDir, month);
    const [outreach, legal, memory] = await Promise.all([
      getOutreachDatabases(rootDir),
      getLegalDatabases(rootDir),
      getMemoryDatabases(rootDir),
    ]);
    sendJson(response, 200, {
      finance,
      databases: {
        outreach: { datasets: outreach.length, rows: outreach.reduce((sum, item) => sum + item.rows, 0) },
        legal: { documents: legal.length },
        memory,
      },
      display: {
        monthSpend: formatMoney(finance.totals.monthExpenseMinor),
        upcoming: formatMoney(finance.totals.upcomingMinor),
      },
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/finance/entries") {
    sendJson(response, 200, { entries: await readEntries(rootDir) });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/finance/expenses") {
    const payload = (await readBody(request)) as Record<string, unknown>;
    const entry = await addExpense(rootDir, {
      date: optionalString(payload, "date") ?? new Date().toISOString().slice(0, 10),
      amount: requireString(payload, "amount"),
      currency: optionalString(payload, "currency") ?? "EUR",
      vendor: requireString(payload, "vendor"),
      expenseAccountCode: optionalString(payload, "expenseAccountCode"),
      paymentAccountCode: optionalString(payload, "paymentAccountCode"),
      vatRateBps: optionalNumber(payload, "vatRateBps"),
      vatMode: optionalString(payload, "vatMode") === "net" ? "net" : "gross",
      receiptPath: optionalString(payload, "receiptPath"),
      notes: optionalString(payload, "notes"),
    });
    sendJson(response, 201, { entry });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/finance/subscriptions") {
    sendJson(response, 200, { subscriptions: await readSubscriptions(rootDir) });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/finance/subscriptions") {
    const payload = (await readBody(request)) as Record<string, unknown>;
    const subscription = await addSubscription(rootDir, {
      name: requireString(payload, "name"),
      vendor: requireString(payload, "vendor"),
      startDate: requireString(payload, "startDate"),
      cadence: optionalString(payload, "cadence") === "yearly" ? "yearly" : "monthly",
      amount: requireString(payload, "amount"),
      regularAmount: optionalString(payload, "regularAmount"),
      currency: optionalString(payload, "currency") ?? "EUR",
      vatRateBps: optionalNumber(payload, "vatRateBps"),
      vatMode: optionalString(payload, "vatMode") === "net" ? "net" : "gross",
      expenseAccountCode: optionalString(payload, "expenseAccountCode"),
      paymentAccountCode: optionalString(payload, "paymentAccountCode"),
      discountType: optionalString(payload, "discountType") === "percent" ? "percent" : optionalString(payload, "discountType") === "fixed" ? "fixed" : undefined,
      discountValue: optionalString(payload, "discountValue") ?? optionalNumber(payload, "discountValue"),
      discountPeriods: optionalNumber(payload, "discountPeriods"),
      termMonths: optionalNumber(payload, "termMonths"),
      renewalDate: optionalString(payload, "renewalDate"),
      cancellationDeadline: optionalString(payload, "cancellationDeadline"),
      notes: optionalString(payload, "notes"),
    });
    sendJson(response, 201, { subscription });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/finance/budgets") {
    sendJson(response, 200, { budgets: await readBudgets(rootDir) });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/finance/budgets") {
    const payload = (await readBody(request)) as Record<string, unknown>;
    const budget = await addBudget(rootDir, {
      month: requireString(payload, "month"),
      category: requireString(payload, "category"),
      amount: requireString(payload, "amount"),
      currency: optionalString(payload, "currency") ?? "EUR",
      notes: optionalString(payload, "notes"),
    });
    sendJson(response, 201, { budget });
    return;
  }

  const reportMatch = url.pathname.match(/^\/api\/finance\/reports\/month\/(\d{4}-\d{2})$/);
  if (request.method === "GET" && reportMatch) {
    sendJson(response, 200, await generateMonthReport(rootDir, reportMatch[1]));
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/databases/outreach") {
    sendJson(response, 200, { datasets: await getOutreachDatabases(rootDir) });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/databases/legal") {
    sendJson(response, 200, { documents: await getLegalDatabases(rootDir) });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/databases/memory") {
    sendJson(response, 200, await getMemoryDatabases(rootDir));
    return;
  }

  sendJson(response, 404, { error: "Not found" });
}

async function serveStatic(publicDir: string, url: URL, response: ServerResponse): Promise<void> {
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const decodedPath = decodeURIComponent(pathname);
  const filePath = path.resolve(publicDir, `.${decodedPath}`);
  const root = path.resolve(publicDir);
  if (!filePath.startsWith(root)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypeFor(filePath),
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch {
    sendText(response, 404, "Not found");
  }
}

export function createDashboardServer(options: DashboardServerOptions = {}): http.Server {
  const rootDir = options.rootDir ?? process.cwd();
  const publicDir = options.publicDir ?? defaultPublicDir;

  return http.createServer(async (request, response) => {
    try {
      const host = request.headers.host ?? "localhost";
      const url = new URL(request.url ?? "/", `http://${host}`);
      response.setHeader("X-Robots-Tag", "noindex, nofollow");
      response.setHeader("Cross-Origin-Resource-Policy", "same-origin");
      response.setHeader("Referrer-Policy", "no-referrer");

      if (url.pathname.startsWith("/api/")) {
        await handleApi(rootDir, request, response, url);
        return;
      }
      await serveStatic(publicDir, url, response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendJson(response, 500, { error: message });
    }
  });
}

async function main(): Promise<void> {
  const rootDir = process.cwd();
  await ensureFinanceStore(rootDir);
  const port = Number.parseInt(process.env.DASHBOARD_PORT ?? "4177", 10);
  const host = "127.0.0.1";
  const server = createDashboardServer({ rootDir });
  server.listen(port, host, () => {
    console.log(`Renvoo private dashboard running at http://localhost:${port}`);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
