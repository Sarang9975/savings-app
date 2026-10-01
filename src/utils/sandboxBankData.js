/**
 * GoalCast — Sandbox Bank Data (Account Aggregator Simulation)
 *
 * Mimics data format returned by Setu AA / Finvu sandbox APIs.
 * This is MOCK DATA for demonstration purposes only.
 * In production: user grants consent first → AA fetches FIP data → encrypted relay.
 *
 * Standards:
 *   - RBI Account Aggregator Framework (Sahamati)
 *   - FIP/FIU specification: https://api.rebit.org.in
 *
 * ⚠️  ALL AMOUNTS, NAMES, ACCOUNT NUMBERS ARE FICTIONAL.
 *     No real personal or banking data is used.
 */

// Simulate 3 months of realistic transaction data for a freelancer/salaried hybrid
const today = new Date();
const fmt = (d) => d.toISOString().slice(0, 10);

function daysAgo(n) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmt(d);
}

export const SANDBOX_ACCOUNT = {
  fiType: 'DEPOSIT',
  bank: 'HDFC Bank',
  bankShort: 'HDFC',
  bankLogo: '🏦',
  accountMasked: 'XXXX-XXXX-4821',
  accountType: 'SAVINGS',
  holderName: 'Demo User',
  ifsc: 'HDFC0001234',
  balance: 38400,
  currency: 'INR',
  source: 'Setu AA Sandbox',
  fetchedAt: new Date().toISOString(),
  consentId: 'AA-DEMO-' + Math.random().toString(36).slice(2, 10).toUpperCase()
};

export const SANDBOX_TRANSACTIONS = [
  // ── September (month -1) ────────────────────────────────
  { id: 'txn-1',  date: daysAgo(4),  amount:  45000, type: 'CREDIT', narration: 'NEFT/INWARD/TechCorp Solutions Pvt Ltd/Salary Sep 2026',  category: 'Salary' },
  { id: 'txn-2',  date: daysAgo(5),  amount:  18000, type: 'CREDIT', narration: 'IMPS/Freelance/Rahul Sharma/Website Redesign Phase 2',      category: 'Freelance' },
  { id: 'txn-3',  date: daysAgo(6),  amount: -12000, type: 'DEBIT',  narration: 'UPI/Rent Payment/Society Office/Housing Sep',               category: 'Rent' },
  { id: 'txn-4',  date: daysAgo(8),  amount:  -4200, type: 'DEBIT',  narration: 'UPI/Swiggy/Food Delivery',                                  category: 'Food' },
  { id: 'txn-5',  date: daysAgo(10), amount:  -2800, type: 'DEBIT',  narration: 'NACH/BSNL Fibre/Internet Plan',                             category: 'Bills' },
  { id: 'txn-6',  date: daysAgo(12), amount:  -3500, type: 'DEBIT',  narration: 'UPI/Amazon Pay/Online Shopping',                            category: 'Shopping' },
  { id: 'txn-7',  date: daysAgo(14), amount:  -1800, type: 'DEBIT',  narration: 'UPI/Ola Cabs/Commute',                                      category: 'Travel' },
  { id: 'txn-8',  date: daysAgo(16), amount:  -2500, type: 'DEBIT',  narration: 'ATM WDL/HDFC ATM Mumbai',                                   category: 'Cash' },
  { id: 'txn-9',  date: daysAgo(18), amount:   8000, type: 'CREDIT', narration: 'IMPS/Tutoring Fee/Akshay Kumar/React Course',               category: 'Freelance' },
  { id: 'txn-10', date: daysAgo(22), amount:  -4800, type: 'DEBIT',  narration: 'NACH/LIC Premium/Life Insurance',                           category: 'Insurance' },
  { id: 'txn-11', date: daysAgo(25), amount:  -3200, type: 'DEBIT',  narration: 'UPI/Netflix,Spotify,GPT-Plus/Subscriptions',                category: 'Subscriptions' },

  // ── August (month -2) ───────────────────────────────────
  { id: 'txn-12', date: daysAgo(35), amount:  45000, type: 'CREDIT', narration: 'NEFT/INWARD/TechCorp Solutions Pvt Ltd/Salary Aug 2026',  category: 'Salary' },
  { id: 'txn-13', date: daysAgo(37), amount:  22000, type: 'CREDIT', narration: 'IMPS/Freelance/Sneha Builders/App Development Milestone',   category: 'Freelance' },
  { id: 'txn-14', date: daysAgo(38), amount: -12000, type: 'DEBIT',  narration: 'UPI/Rent Payment/Society Office/Housing Aug',               category: 'Rent' },
  { id: 'txn-15', date: daysAgo(40), amount:  -5100, type: 'DEBIT',  narration: 'UPI/Swiggy/Zomato/Food Delivery',                           category: 'Food' },
  { id: 'txn-16', date: daysAgo(42), amount:  -2800, type: 'DEBIT',  narration: 'NACH/BSNL Fibre/Internet Plan',                             category: 'Bills' },
  { id: 'txn-17', date: daysAgo(45), amount:  -6500, type: 'DEBIT',  narration: 'UPI/Flipkart/Electronics',                                  category: 'Shopping' },
  { id: 'txn-18', date: daysAgo(48), amount:   5000, type: 'CREDIT', narration: 'UPI/Referral Bonus/Zerodha Referral',                       category: 'Bonus' },
  { id: 'txn-19', date: daysAgo(52), amount:  -2100, type: 'DEBIT',  narration: 'UPI/Medical/Apollo Pharmacy',                               category: 'Health' },
  { id: 'txn-20', date: daysAgo(55), amount:  -4800, type: 'DEBIT',  narration: 'NACH/LIC Premium/Life Insurance',                           category: 'Insurance' },

  // ── July (month -3) ─────────────────────────────────────
  { id: 'txn-21', date: daysAgo(68), amount:  45000, type: 'CREDIT', narration: 'NEFT/INWARD/TechCorp Solutions Pvt Ltd/Salary Jul 2026',  category: 'Salary' },
  { id: 'txn-22', date: daysAgo(70), amount:  12000, type: 'CREDIT', narration: 'IMPS/Freelance/Vikram Agencies/SEO Consulting',             category: 'Freelance' },
  { id: 'txn-23', date: daysAgo(72), amount: -12000, type: 'DEBIT',  narration: 'UPI/Rent Payment/Society Office/Housing Jul',               category: 'Rent' },
  { id: 'txn-24', date: daysAgo(74), amount:  -3900, type: 'DEBIT',  narration: 'UPI/Swiggy/Food Delivery',                                  category: 'Food' },
  { id: 'txn-25', date: daysAgo(76), amount:  -2800, type: 'DEBIT',  narration: 'NACH/BSNL Fibre/Internet Plan',                             category: 'Bills' },
  { id: 'txn-26', date: daysAgo(80), amount:  -4200, type: 'DEBIT',  narration: 'UPI/Amazon Pay/Online Shopping',                            category: 'Shopping' },
  { id: 'txn-27', date: daysAgo(83), amount:   3000, type: 'CREDIT', narration: 'UPI/Content Writing/Blog Client',                           category: 'Freelance' },
  { id: 'txn-28', date: daysAgo(86), amount:  -4800, type: 'DEBIT',  narration: 'NACH/LIC Premium/Life Insurance',                           category: 'Insurance' },
  { id: 'txn-29', date: daysAgo(88), amount:  -1500, type: 'DEBIT',  narration: 'UPI/Rapido/Commute',                                        category: 'Travel' },
];

// ── DERIVED ANALYTICS ──────────────────────────────────────────────────────────

function analyzeTransactions(transactions) {
  const credits = transactions.filter(t => t.type === 'CREDIT');
  const debits  = transactions.filter(t => t.type === 'DEBIT');

  // Group credits by category
  const salaryCreditsList  = credits.filter(t => t.category === 'Salary');
  const freelanceCreditsList = credits.filter(t => t.category === 'Freelance');
  const bonusCreditsList   = credits.filter(t => t.category === 'Bonus');

  const totalCredits  = credits.reduce((s, t) => s + t.amount, 0);
  const totalDebits   = Math.abs(debits.reduce((s, t) => s + t.amount, 0));
  const salaryTotal   = salaryCreditsList.reduce((s, t) => s + t.amount, 0);
  const freelanceTotal = freelanceCreditsList.reduce((s, t) => s + t.amount, 0);
  const bonusTotal    = bonusCreditsList.reduce((s, t) => s + t.amount, 0);

  const months = 3;
  const avgMonthlyIncome   = Math.round(totalCredits / months);
  const avgMonthlyExpenses = Math.round(totalDebits / months);
  const avgSalary          = Math.round(salaryTotal / months);
  const avgFreelance       = Math.round(freelanceTotal / months);
  const avgSurplus         = avgMonthlyIncome - avgMonthlyExpenses;

  // Expense breakdown
  const rentTotal = Math.abs(debits.filter(t => t.category === 'Rent').reduce((s, t) => s + t.amount, 0));
  const foodTotal = Math.abs(debits.filter(t => t.category === 'Food').reduce((s, t) => s + t.amount, 0));
  const billsTotal = Math.abs(debits.filter(t => t.category === 'Bills').reduce((s, t) => s + t.amount, 0));

  return {
    totalCredits,
    totalDebits,
    avgMonthlyIncome,
    avgMonthlyExpenses,
    avgSurplus,
    avgSalary,
    avgFreelance,
    bonusTotal,
    rentPerMonth: Math.round(rentTotal / months),
    foodPerMonth: Math.round(foodTotal / months),
    billsPerMonth: Math.round(billsTotal / months),
    months
  };
}

/** Parse transaction history → structured income streams for GoalCast */
export function deriveIncomeStreams(transactions) {
  const analytics = analyzeTransactions(transactions);
  const streams = [];

  if (analytics.avgSalary > 0) {
    streams.push({
      id: 'bank-stream-salary',
      title: 'Monthly Salary (TechCorp Solutions)',
      amount: analytics.avgSalary,
      type: 'recurring',
      probability: 98,
      active: true,
      targetMonthOffset: 1,
      source: 'bank' // mark as bank-connected
    });
  }

  if (analytics.avgFreelance > 0) {
    streams.push({
      id: 'bank-stream-freelance',
      title: `Freelance Projects (₹${analytics.avgFreelance.toLocaleString('en-IN')}/mo avg, last 3mo)`,
      amount: analytics.avgFreelance,
      type: 'freelance',
      probability: 65,
      active: true,
      targetMonthOffset: 1,
      source: 'bank'
    });
  }

  if (analytics.bonusTotal > 0) {
    streams.push({
      id: 'bank-stream-bonus',
      title: 'Referral / Bonus (occasional)',
      amount: Math.round(analytics.bonusTotal / analytics.months),
      type: 'opportunity',
      probability: 30,
      active: true,
      targetMonthOffset: 2,
      source: 'bank'
    });
  }

  return { streams, analytics };
}

/** Parse a user-uploaded CSV bank statement */
export function parseStatementCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const transactions = [];
  
  // Auto-detect header row
  const headerLine = lines[0].toLowerCase();
  const hasHeader = headerLine.includes('date') || headerLine.includes('narration') || headerLine.includes('amount');
  const startIdx = hasHeader ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length < 3) continue;
    
    // Try common CSV layouts: Date, Narration, Debit, Credit, Balance
    let date = cols[0];
    let narration = cols[1] || '';
    let debit = parseFloat((cols[2] || '').replace(/[₹,]/g, '')) || 0;
    let credit = parseFloat((cols[3] || '').replace(/[₹,]/g, '')) || 0;

    // Simple layout: Date, Narration, Amount (positive = credit)
    if (cols.length === 3) {
      const amt = parseFloat((cols[2] || '').replace(/[₹,]/g, '')) || 0;
      credit = amt > 0 ? amt : 0;
      debit  = amt < 0 ? Math.abs(amt) : 0;
    }

    if (credit > 0) {
      transactions.push({ id: `csv-${i}`, date, narration, amount: credit, type: 'CREDIT', category: guessCategory(narration, 'CREDIT') });
    } else if (debit > 0) {
      transactions.push({ id: `csv-${i}`, date, narration, amount: -debit, type: 'DEBIT', category: guessCategory(narration, 'DEBIT') });
    }
  }
  return transactions;
}

function guessCategory(narration, type) {
  const n = narration.toLowerCase();
  if (type === 'CREDIT') {
    if (n.includes('salary') || n.includes('sal/')) return 'Salary';
    if (n.includes('freelance') || n.includes('project') || n.includes('consulting')) return 'Freelance';
    if (n.includes('bonus') || n.includes('incentive') || n.includes('referral')) return 'Bonus';
    return 'Other Income';
  }
  if (n.includes('rent') || n.includes('housing')) return 'Rent';
  if (n.includes('swiggy') || n.includes('zomato') || n.includes('food')) return 'Food';
  if (n.includes('lic') || n.includes('insurance')) return 'Insurance';
  return 'Expense';
}

export { analyzeTransactions };
