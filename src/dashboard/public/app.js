const state = {
  month: new Date().toISOString().slice(0, 7),
  summary: null,
  outreach: [],
  legal: [],
  memory: null,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const money = (minor = 0, currency = "EUR") => {
  const sign = minor < 0 ? "-" : "";
  const absolute = Math.abs(minor);
  return `${sign}${Math.trunc(absolute / 100)}.${String(absolute % 100).padStart(2, "0")} ${currency}`;
};

const api = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }
  return payload;
};

const entryAmount = (entry) => {
  if (entry.reportingAmountMinor) return entry.reportingAmountMinor;
  if (entry.vat?.grossAmountMinor) return entry.vat.grossAmountMinor;
  return entry.lines.find((line) => line.side === "credit")?.amountMinor ?? 0;
};

const accountForEntry = (entry, accounts) => {
  const expenseLine = entry.lines.find((line) => {
    const account = accounts.find((item) => item.code === line.accountCode);
    return account?.type === "expense";
  });
  return expenseLine ? accounts.find((item) => item.code === expenseLine.accountCode) : null;
};

const setCount = (name, value, suffix) => {
  const slot = $(`[data-count="${name}"]`);
  if (slot) slot.textContent = `${value} ${suffix}`;
};

const empty = (text) => `<div class="stack-row muted">${text}</div>`;

function renderSelects(accounts) {
  const expense = $("[data-expense-accounts]");
  const payment = $("[data-payment-accounts]");
  if (!expense || !payment) return;
  expense.innerHTML = accounts
    .filter((account) => account.type === "expense")
    .map((account) => `<option value="${account.code}">${account.code} ${account.name}</option>`)
    .join("");
  payment.innerHTML = accounts
    .filter((account) => account.type === "asset" || account.type === "liability")
    .map((account) => `<option value="${account.code}">${account.code} ${account.name}</option>`)
    .join("");
  payment.value = "1000";
}

function renderOverview(finance) {
  $("[data-metric='monthSpend']").textContent = money(finance.totals.monthExpenseMinor);
  $("[data-metric='allTimeSpend']").textContent = money(finance.totals.allTimeExpenseMinor);
  $("[data-metric='upcoming']").textContent = money(finance.totals.upcomingMinor);
  $("[data-metric='vat']").textContent = money(finance.totals.vatRecoverableMinor);

  const maxCategory = Math.max(1, ...finance.categoryTotals.map((item) => Math.abs(item.amountMinor)));
  $("[data-categories]").innerHTML =
    finance.categoryTotals.length === 0
      ? empty("No spending in this month.")
      : finance.categoryTotals
          .map(
            (item) => `
            <div class="bar-row">
              <div class="row-main"><strong>${item.category}</strong><span>${money(item.amountMinor, item.currency)}</span></div>
              <div class="progress"><span style="--value:${Math.round((Math.abs(item.amountMinor) / maxCategory) * 100)}%"></span></div>
            </div>`,
          )
          .join("");
  setCount("categories", finance.categoryTotals.length, "categories");

  $("[data-upcoming]").innerHTML =
    finance.upcoming.length === 0
      ? empty("No upcoming charges recorded.")
      : finance.upcoming
          .slice(0, 8)
          .map(
            (item) => `
            <div class="stack-row">
              <div class="row-main"><strong>${item.subscriptionName}</strong><span>${money(item.grossAmountMinor, item.currency)}</span></div>
              <span class="muted">${item.chargeDate}${item.stepUpAmountMinor ? ` · step-up ${money(item.stepUpAmountMinor, item.currency)}` : ""}</span>
            </div>`,
          )
          .join("");
  setCount("upcoming", finance.upcoming.length, "charges");

  $("[data-budget-state]").innerHTML =
    finance.budgets.length === 0
      ? empty("No budgets for this month.")
      : finance.budgets
          .map((item) => {
            const tone = item.remainingMinor < 0 ? "bad" : item.percentUsed > 80 ? "warn" : "";
            return `
              <div class="stack-row">
                <div class="row-main"><strong>${item.category}</strong><span class="pill ${tone}">${item.percentUsed}%</span></div>
                <span class="muted">${money(item.spentMinor, item.currency)} spent · ${money(item.remainingMinor, item.currency)} left</span>
              </div>`;
          })
          .join("");
  setCount("budgets", finance.budgets.length, "budgets");
}

function renderTransactions(finance) {
  const query = ($("[data-transaction-search]")?.value ?? "").toLowerCase();
  const rows = finance.entries
    .filter((entry) => JSON.stringify(entry).toLowerCase().includes(query))
    .sort((left, right) => right.date.localeCompare(left.date))
    .map((entry) => {
      const account = accountForEntry(entry, finance.accounts);
      return `
        <tr>
          <td>${entry.date}</td>
          <td>${entry.description}</td>
          <td>${entry.vendor ?? entry.counterparty ?? ""}</td>
          <td>${account ? `${account.code} ${account.name}` : ""}</td>
          <td><span class="pill">${entry.status}</span></td>
          <td class="number">${money(entryAmount(entry), entry.reportingCurrency ?? entry.vat?.currency ?? "EUR")}</td>
        </tr>`;
    });
  $("[data-transactions]").innerHTML = rows.join("") || `<tr><td colspan="6">No transactions recorded.</td></tr>`;
}

function renderForms(finance) {
  renderSelects(finance.accounts);
  $("[data-accounts]").innerHTML = finance.accounts
    .map((account) => `<div class="account-row"><strong>${account.code}</strong> ${account.name}<br><span class="muted">${account.type} · ${account.publicCategory}</span></div>`)
    .join("");
  setCount("accounts", finance.accounts.length, "accounts");
}

function renderRecurring(finance) {
  $("[data-subscriptions]").innerHTML =
    finance.subscriptions.length === 0
      ? empty("No subscriptions recorded.")
      : finance.subscriptions
          .map(
            (item) => `
            <div class="stack-row">
              <div class="row-main"><strong>${item.name}</strong><span>${money(item.regularAmountMinor, item.currency)}</span></div>
              <span class="muted">${item.cadence} · starts ${item.startDate}${item.cancellationDeadline ? ` · cancel by ${item.cancellationDeadline}` : ""}</span>
            </div>`,
          )
          .join("");
  setCount("subscriptions", finance.subscriptions.length, "subscriptions");
}

function renderBudgets(finance) {
  $("[data-budgets]").innerHTML =
    finance.budgets.length === 0
      ? empty("No budget envelopes for this month.")
      : finance.budgets
          .map((item) => {
            const clamped = Math.max(0, Math.min(item.percentUsed, 140));
            return `
              <div class="bar-row">
                <div class="row-main"><strong>${item.category}</strong><span>${money(item.remainingMinor, item.currency)} left</span></div>
                <div class="progress"><span style="--value:${clamped}%"></span></div>
                <span class="muted">${money(item.spentMinor, item.currency)} of ${money(item.amountMinor, item.currency)}</span>
              </div>`;
          })
          .join("");
  setCount("budgetRows", finance.budgets.length, "rows");
}

function renderDataExplorer() {
  $("[data-outreach]").innerHTML =
    state.outreach
      .map((item) => {
        const status = Object.entries(item.statusCounts).slice(0, 4).map(([key, count]) => `${key}: ${count}`).join(" · ");
        return `<div class="data-row"><strong>${item.name}</strong><br><span class="muted">${item.rows} rows · ${item.columns.length} columns${status ? ` · ${status}` : ""}</span></div>`;
      })
      .join("") || empty("No outreach databases found.");
  setCount("outreach", state.outreach.length, "files");

  $("[data-legal]").innerHTML =
    state.legal
      .map((item) => `<div class="data-row"><strong>${item.title}</strong><br><span class="muted">${item.section} · ${item.file}</span></div>`)
      .join("") || empty("No legal registers found.");
  setCount("legal", state.legal.length, "docs");

  if (state.memory) {
    const counts = Object.entries(state.memory.counts).map(([key, value]) => `<div class="data-row"><strong>${key}</strong><br><span class="muted">${value} notes</span></div>`);
    $("[data-memory]").innerHTML = counts.join("");
  }
}

function renderAll() {
  const finance = state.summary.finance;
  renderOverview(finance);
  renderTransactions(finance);
  renderForms(finance);
  renderRecurring(finance);
  renderBudgets(finance);
  renderDataExplorer();
}

async function loadAll() {
  const summary = await api(`/api/dashboard/summary?month=${encodeURIComponent(state.month)}`);
  const [outreach, legal, memory] = await Promise.all([
    api("/api/databases/outreach"),
    api("/api/databases/legal"),
    api("/api/databases/memory"),
  ]);
  state.summary = summary;
  state.outreach = outreach.datasets;
  state.legal = legal.documents;
  state.memory = memory;
  renderAll();
}

function formPayload(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function setStatus(selector, message, isError = false) {
  const slot = $(selector);
  if (!slot) return;
  slot.textContent = message;
  slot.style.color = isError ? "var(--bad)" : "var(--good)";
}

function setupNavigation() {
  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".nav-item").forEach((item) => item.classList.remove("is-active"));
      $$(".view").forEach((view) => view.classList.remove("is-active"));
      button.classList.add("is-active");
      $(`[data-panel="${button.dataset.view}"]`)?.classList.add("is-active");
    });
  });
}

function setupForms() {
  $("[data-month]").value = state.month;
  $("[data-month]").addEventListener("change", async (event) => {
    state.month = event.target.value;
    await loadAll();
  });
  $("[data-refresh]").addEventListener("click", loadAll);
  $("[data-transaction-search]").addEventListener("input", () => renderTransactions(state.summary.finance));

  $("[data-expense-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/finance/expenses", { method: "POST", body: JSON.stringify(formPayload(event.currentTarget)) });
      event.currentTarget.reset();
      event.currentTarget.elements.currency.value = "EUR";
      event.currentTarget.elements.vatRateBps.value = "0";
      setStatus("[data-expense-status]", "Expense added.");
      await loadAll();
    } catch (error) {
      setStatus("[data-expense-status]", error.message, true);
    }
  });

  $("[data-subscription-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/finance/subscriptions", { method: "POST", body: JSON.stringify(formPayload(event.currentTarget)) });
      event.currentTarget.reset();
      setStatus("[data-subscription-status]", "Subscription added.");
      await loadAll();
    } catch (error) {
      setStatus("[data-subscription-status]", error.message, true);
    }
  });

  $("[data-budget-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/finance/budgets", { method: "POST", body: JSON.stringify(formPayload(event.currentTarget)) });
      event.currentTarget.reset();
      event.currentTarget.elements.currency.value = "EUR";
      setStatus("[data-budget-status]", "Budget added.");
      await loadAll();
    } catch (error) {
      setStatus("[data-budget-status]", error.message, true);
    }
  });

  $("[data-report-button]").addEventListener("click", async () => {
    const report = await api(`/api/finance/reports/month/${state.month}`);
    $("[data-private-report]").textContent = report.privateReport;
    $("[data-public-preview]").textContent = JSON.stringify(report.publicSummaryPreview, null, 2);
  });
}

setupNavigation();
setupForms();
loadAll().catch((error) => {
  document.body.innerHTML = `<main class="workspace"><section class="panel"><h1>Dashboard failed</h1><p>${error.message}</p></section></main>`;
});
