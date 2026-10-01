/**
 * GoalCast Financial & Cash Flow Prediction Engine
 * Supports:
 * - Variable / Irregular Income modeling (Recurring, Freelance, Opportunity, Pipeline)
 * - Risk-adjusted probability expectations (Expected = Probability * Amount)
 * - 3-Scenario Forecasts: Conservative, Expected, Optimistic
 * - Financial Weather Forecast (☀️ Sunny, 🌤️ Partly Cloudy, 🌧️ Rainy)
 * - Affordability Windows & Purchase Probability Curves for Goals
 * - 6% Annual Compound Interest on accumulated savings
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const ANNUAL_INTEREST_RATE = 0.06; // 6% yearly interest

export function formatCurrency(amount, currency = 'INR') {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const val = Math.round(amount);
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);
}

export function getTargetDate(monthsToAdd, baseDate = new Date()) {
  if (monthsToAdd === Infinity || monthsToAdd === null || isNaN(monthsToAdd)) {
    return {
      monthName: 'Indefinite',
      year: '—',
      fullString: 'Never (Deficit or Zero Savings)'
    };
  }

  const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + Math.ceil(monthsToAdd), 1);
  const monthName = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();

  return {
    monthName,
    year,
    fullString: `${monthName} ${year}`
  };
}

/**
 * Calculate expected value of an income pipeline
 */
export function calculatePipelineMetrics(incomeStreams) {
  let grossPotential = 0;
  let riskAdjustedExpected = 0;
  let confirmedAmount = 0;
  let pipelineAmount = 0;

  incomeStreams.forEach(stream => {
    if (!stream.active) return;
    const amount = Number(stream.amount) || 0;
    const prob = Math.min(100, Math.max(0, Number(stream.probability) || 0));
    grossPotential += amount;
    const expected = (amount * prob) / 100;
    riskAdjustedExpected += expected;

    if (prob >= 90) {
      confirmedAmount += amount;
    } else {
      pipelineAmount += amount;
    }
  });

  return {
    grossPotential: Math.round(grossPotential),
    riskAdjustedExpected: Math.round(riskAdjustedExpected),
    confirmedAmount: Math.round(confirmedAmount),
    pipelineAmount: Math.round(pipelineAmount),
    realizationRate: grossPotential > 0 ? Math.round((riskAdjustedExpected / grossPotential) * 100) : 0
  };
}

/**
 * Predict next 6 to 12 months of cash flow across 3 Scenarios
 * (Conservative, Expected, Optimistic)
 */
export function generateCashflowForecast(incomeStreams, monthlyExpenses, monthsCount = 6, baseDate = new Date()) {
  const expense = Number(monthlyExpenses) || 20000;
  const forecast = [];

  for (let m = 1; m <= monthsCount; m++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + m, 1);
    const monthLabel = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    const shortLabel = `${MONTH_NAMES[d.getMonth()].slice(0, 3)} '${String(d.getFullYear()).slice(-2)}`;

    // Calculate month income based on stream recurrence and timing
    let monthExpectedIncome = 0;
    let monthConservativeIncome = 0;
    let monthOptimisticIncome = 0;

    incomeStreams.forEach(stream => {
      if (!stream.active) return;
      const amt = Number(stream.amount) || 0;
      const prob = (Number(stream.probability) || 0) / 100;

      // Type-based logic
      if (stream.type === 'recurring') {
        // Recurring income happens every month
        monthExpectedIncome += amt * prob;
        monthConservativeIncome += amt * Math.min(1, prob * 0.95);
        monthOptimisticIncome += amt;
      } else if (stream.type === 'freelance') {
        // Freelance project: either recurring or planned in specific month
        const streamMonth = stream.targetMonthOffset || 1;
        if (stream.isMonthly || streamMonth === m) {
          monthExpectedIncome += amt * prob;
          monthConservativeIncome += prob >= 0.7 ? amt * 0.7 : 0;
          monthOptimisticIncome += amt;
        }
      } else if (stream.type === 'opportunity') {
        // Hackathons, prize, bonuses
        const streamMonth = stream.targetMonthOffset || 2;
        if (streamMonth === m) {
          monthExpectedIncome += amt * prob;
          monthConservativeIncome += prob >= 0.8 ? amt * 0.5 : 0;
          monthOptimisticIncome += amt;
        }
      }
    });

    // Net Surplus
    const expectedSurplus = Math.round(monthExpectedIncome - expense);
    const conservativeSurplus = Math.round(monthConservativeIncome - expense);
    const optimisticSurplus = Math.round(monthOptimisticIncome - expense);

    // Weather condition
    let weather = 'sunny';
    let weatherEmoji = '☀️';
    let weatherCondition = 'High Surplus';

    if (expectedSurplus < 0) {
      weather = 'stormy';
      weatherEmoji = '⛈️';
      weatherCondition = 'Cashflow Deficit';
    } else if (expectedSurplus < 6000) {
      weather = 'rainy';
      weatherEmoji = '🌧️';
      weatherCondition = 'Tight Margin';
    } else if (expectedSurplus < 16000) {
      weather = 'cloudy';
      weatherEmoji = '🌤️';
      weatherCondition = 'Moderate Surplus';
    }

    // Confidence decreases by 5% per month out
    const confidence = Math.max(45, 95 - (m - 1) * 8);

    forecast.push({
      monthIndex: m,
      monthLabel,
      shortLabel,
      expectedIncome: Math.round(monthExpectedIncome),
      conservativeIncome: Math.round(monthConservativeIncome),
      optimisticIncome: Math.round(monthOptimisticIncome),
      expense,
      expectedSurplus,
      conservativeSurplus,
      optimisticSurplus,
      weather,
      weatherEmoji,
      weatherCondition,
      confidence
    });
  }

  return forecast;
}

/**
 * Predict Goal Affordability Windows using Variable Cashflow Forecast
 * Returns Conservative ETA, Expected ETA, Optimistic ETA, and Probability Curve
 */
export function calculateVariableAffordability(goal, currentSavings, forecast, useInterest = true, annualRate = ANNUAL_INTEREST_RATE) {
  const price = Number(goal.price) || 0;
  const initialSaved = Number(currentSavings) || 0;
  const monthlyRate = annualRate / 12;

  if (initialSaved >= price && price > 0) {
    return {
      isAchieved: true,
      expectedMonths: 0,
      conservativeMonths: 0,
      optimisticMonths: 0,
      expectedDate: getTargetDate(0),
      conservativeDate: getTargetDate(0),
      optimisticDate: getTargetDate(0),
      affordabilityWindow: 'Immediately Affordable',
      probabilityCurve: [{ month: 0, probability: 100, expectedCash: initialSaved }],
      riskMessage: 'You already possess sufficient cash to afford this goal today!'
    };
  }

  // Simulate cumulative cash balance under the 3 scenarios
  let balanceExp = initialSaved;
  let balanceCons = initialSaved;
  let balanceOpt = initialSaved;

  let expectedMonths = Infinity;
  let conservativeMonths = Infinity;
  let optimisticMonths = Infinity;

  const probabilityCurve = [{ month: 0, probability: initialSaved >= price ? 100 : Math.round((initialSaved / price) * 100), expectedCash: initialSaved }];

  forecast.forEach((step, idx) => {
    const m = idx + 1;

    // Apply 6% monthly compound interest if enabled
    const interestExp = useInterest ? balanceExp * monthlyRate : 0;
    const interestCons = useInterest ? balanceCons * monthlyRate : 0;
    const interestOpt = useInterest ? balanceOpt * monthlyRate : 0;

    balanceExp = balanceExp + interestExp + Math.max(0, step.expectedSurplus);
    balanceCons = balanceCons + interestCons + Math.max(0, step.conservativeSurplus);
    balanceOpt = balanceOpt + interestOpt + Math.max(0, step.optimisticSurplus);

    if (balanceOpt >= price && optimisticMonths === Infinity) {
      optimisticMonths = m;
    }
    if (balanceExp >= price && expectedMonths === Infinity) {
      expectedMonths = m;
    }
    if (balanceCons >= price && conservativeMonths === Infinity) {
      conservativeMonths = m;
    }

    // Affordability probability for this month:
    // Ratio of balance vs price, scaled by forecast confidence
    const cashRatio = Math.min(1.5, balanceExp / price);
    let prob = 0;
    if (cashRatio >= 1.0) {
      prob = Math.min(99, Math.round(75 + (step.confidence * 0.24)));
    } else {
      prob = Math.min(65, Math.round(cashRatio * 60));
    }

    probabilityCurve.push({
      month: m,
      monthLabel: step.shortLabel,
      probability: prob,
      expectedCash: Math.round(balanceExp),
      conservativeCash: Math.round(balanceCons),
      optimisticCash: Math.round(balanceOpt)
    });
  });

  // If still not reached within forecast window, extrapolate using average expected surplus
  const avgSurplus = forecast.reduce((s, f) => s + f.expectedSurplus, 0) / forecast.length;
  if (expectedMonths === Infinity) {
    if (avgSurplus <= 0) {
      expectedMonths = Infinity;
      conservativeMonths = Infinity;
      optimisticMonths = Infinity;
    } else {
      const remaining = price - balanceExp;
      const extraMonths = Math.ceil(remaining / avgSurplus);
      expectedMonths = forecast.length + extraMonths;
      conservativeMonths = forecast.length + Math.ceil((price - balanceCons) / Math.max(1000, avgSurplus * 0.7));
      optimisticMonths = forecast.length + Math.ceil((price - balanceOpt) / Math.max(1000, avgSurplus * 1.3));
    }
  }

  const expectedDate = getTargetDate(expectedMonths);
  const conservativeDate = getTargetDate(conservativeMonths);
  const optimisticDate = getTargetDate(optimisticMonths);

  return {
    isAchieved: false,
    expectedMonths,
    conservativeMonths,
    optimisticMonths,
    expectedDate,
    conservativeDate,
    optimisticDate,
    affordabilityWindow: `${optimisticDate.monthName} ${optimisticDate.year} – ${conservativeDate.monthName} ${conservativeDate.year}`,
    probabilityCurve,
    isUnattainable: expectedMonths === Infinity,
    riskMessage: expectedMonths === Infinity
      ? 'Expected monthly surplus is ₹0 or negative. Unable to afford without added revenue.'
      : `High confidence of purchase readiness by ${expectedDate.fullString} (${expectedMonths} months).`
  };
}

/**
 * Standard fixed timeline fallback (for Problem Statement 12 compliance)
 */
export function calculateGoalTimeline(price, saved, monthlySaving, useInterest = true, annualRate = ANNUAL_INTEREST_RATE) {
  const p = Math.max(0, Number(price) || 0);
  const s = Math.max(0, Number(saved) || 0);
  const m = Math.max(0, Number(monthlySaving) || 0);

  if (s >= p && p > 0) {
    return {
      months: 0,
      targetDate: getTargetDate(0),
      isAchieved: true,
      isZeroSaving: false,
      totalDeposited: s,
      interestEarned: 0,
      finalBalance: s,
      monthlySchedule: [{ month: 0, balance: s, deposited: s, interest: 0 }],
      monthsSavedWithInterest: 0,
      interestBenefit: 0,
      progressPct: 100,
      riskLevel: 'achieved',
      riskMessage: 'Target already reached! You have enough savings.'
    };
  }

  if (m === 0) {
    const progressPct = p > 0 ? Math.min(100, (s / p) * 100) : 0;
    return {
      months: Infinity,
      targetDate: getTargetDate(Infinity),
      isAchieved: false,
      isZeroSaving: true,
      totalDeposited: s,
      interestEarned: 0,
      finalBalance: s,
      monthlySchedule: [{ month: 0, balance: s, deposited: s, interest: 0 }],
      monthsSavedWithInterest: 0,
      interestBenefit: 0,
      progressPct,
      riskLevel: 'unrealistic',
      riskMessage: 'Monthly saving is ₹0. This goal will never be reached without regular contributions or a lump sum!'
    };
  }

  const remaining = p - s;
  const monthsNoInterest = Math.ceil(remaining / m);

  const monthlyRate = annualRate / 12;
  let balance = s;
  let monthsWithInterest = 0;
  let schedule = [{ month: 0, balance: s, deposited: s, interest: 0 }];
  let cumInterest = 0;
  let totalDeposited = s;

  const maxMonths = 600;

  while (balance < p && monthsWithInterest < maxMonths) {
    monthsWithInterest++;
    const interestThisMonth = balance * monthlyRate;
    cumInterest += interestThisMonth;
    balance = balance + interestThisMonth + m;
    totalDeposited += m;

    if (monthsWithInterest <= 36 || balance >= p || monthsWithInterest % 6 === 0) {
      schedule.push({
        month: monthsWithInterest,
        balance: Math.round(balance),
        deposited: Math.round(totalDeposited),
        interest: Math.round(cumInterest)
      });
    }
  }

  const effectiveMonths = useInterest ? monthsWithInterest : monthsNoInterest;
  const effectiveFinalBalance = useInterest ? Math.round(balance) : Math.round(s + monthsNoInterest * m);
  const effectiveInterestEarned = useInterest ? Math.round(cumInterest) : 0;
  const effectiveDeposited = useInterest ? Math.round(totalDeposited) : Math.round(s + monthsNoInterest * m);

  const monthsSaved = Math.max(0, monthsNoInterest - monthsWithInterest);
  const interestBenefit = Math.round(cumInterest);
  const progressPct = p > 0 ? Math.min(100, Math.round((s / p) * 100)) : 0;

  let riskLevel = 'on_track';
  let riskMessage = 'On Track: Achievable within a realistic saving timeframe!';
  if (effectiveMonths > 48) {
    riskLevel = 'unrealistic';
    riskMessage = `High Risk: At this rate, it takes ${Math.round(effectiveMonths / 12 * 10) / 10} years. Consider boosting monthly savings.`;
  } else if (effectiveMonths > 20) {
    riskLevel = 'at_risk';
    riskMessage = `Moderate Pace: Takes ${effectiveMonths} months. Increasing monthly saving by 20% would speed this up.`;
  }

  return {
    months: effectiveMonths,
    monthsNoInterest,
    monthsWithInterest,
    targetDate: getTargetDate(effectiveMonths),
    isAchieved: false,
    isZeroSaving: false,
    totalDeposited: effectiveDeposited,
    interestEarned: effectiveInterestEarned,
    finalBalance: effectiveFinalBalance,
    monthlySchedule: schedule,
    monthsSavedWithInterest: monthsSaved,
    interestBenefit,
    progressPct,
    riskLevel,
    riskMessage
  };
}

export function getAccelerationScenarios(goal, useInterest = true) {
  const currentMonthly = goal.monthlySaving || 0;
  if (currentMonthly <= 0) return null;

  const currentTimeline = calculateGoalTimeline(goal.price, goal.saved, currentMonthly, useInterest);
  if (currentTimeline.isAchieved || currentTimeline.months <= 1) return null;

  const boost20 = Math.round(currentMonthly * 1.2 / 100) * 100;
  const timelineBoost20 = calculateGoalTimeline(goal.price, goal.saved, boost20, useInterest);
  const monthsGained20 = Math.max(0, currentTimeline.months - timelineBoost20.months);

  const boostStep = currentMonthly >= 10000 ? 2500 : 1000;
  const boostFixed = currentMonthly + boostStep;
  const timelineBoostFixed = calculateGoalTimeline(goal.price, goal.saved, boostFixed, useInterest);
  const monthsGainedFixed = Math.max(0, currentTimeline.months - timelineBoostFixed.months);

  const drop20 = Math.max(500, Math.round(currentMonthly * 0.8 / 100) * 100);
  const timelineDrop20 = calculateGoalTimeline(goal.price, goal.saved, drop20, useInterest);
  const monthsDelayed20 = Math.max(0, timelineDrop20.months - currentTimeline.months);

  return {
    boost20: {
      amount: boost20,
      diff: boost20 - currentMonthly,
      months: timelineBoost20.months,
      targetDate: timelineBoost20.targetDate,
      monthsGained: monthsGained20
    },
    boostFixed: {
      amount: boostFixed,
      diff: boostStep,
      months: timelineBoostFixed.months,
      targetDate: timelineBoostFixed.targetDate,
      monthsGained: monthsGainedFixed
    },
    drop20: {
      amount: drop20,
      diff: currentMonthly - drop20,
      months: timelineDrop20.months,
      targetDate: timelineDrop20.targetDate,
      monthsDelayed: monthsDelayed20
    }
  };
}

export function calculatePriorityScore(goal, weights = { urgency: 25, progress: 25, speed: 20, importance: 20, price: 10 }) {
  const p = Number(goal.price) || 1;
  const s = Number(goal.saved) || 0;
  const m = Number(goal.monthlySaving) || 0;

  const progressFactor = Math.min(100, (s / p) * 100);

  const timeline = calculateGoalTimeline(p, s, m, true);
  let speedFactor = 0;
  if (timeline.months === 0) speedFactor = 100;
  else if (timeline.months === Infinity) speedFactor = 0;
  else {
    speedFactor = Math.max(5, Math.min(100, Math.round(100 - (timeline.months - 1) * 2.5)));
  }

  const urgencyMap = { high: 100, medium: 60, low: 30 };
  const urgencyFactor = urgencyMap[goal.urgency] || 60;

  const importanceFactor = ((goal.importance || 3) / 5) * 100;

  const priceFactor = Math.max(10, Math.min(100, Math.round(100 - (p / 250000) * 80)));

  const totalWeight = weights.urgency + weights.progress + weights.speed + weights.importance + weights.price;
  const score = (
    urgencyFactor * weights.urgency +
    progressFactor * weights.progress +
    speedFactor * weights.speed +
    importanceFactor * weights.importance +
    priceFactor * weights.price
  ) / (totalWeight || 1);

  return {
    score: Math.round(score),
    factors: {
      progressFactor: Math.round(progressFactor),
      speedFactor: Math.round(speedFactor),
      urgencyFactor: Math.round(urgencyFactor),
      importanceFactor: Math.round(importanceFactor),
      priceFactor: Math.round(priceFactor)
    }
  };
}

export function calculateBudgetSafety(income, essentials, emis, emergencyBuffer, totalCommittedSavings) {
  const inc = Number(income) || 0;
  const ess = Number(essentials) || 0;
  const emi = Number(emis) || 0;
  const buf = Number(emergencyBuffer) || 0;
  const committed = Number(totalCommittedSavings) || 0;

  const totalFixedCosts = ess + emi + buf;
  const safeDisposableCapacity = Math.max(0, inc - totalFixedCosts);
  const remainingCushion = safeDisposableCapacity - committed;
  const utilizationRatio = safeDisposableCapacity > 0 ? (committed / safeDisposableCapacity) * 100 : 100;

  let healthStatus = 'healthy';
  let message = 'Your goals fit comfortably within your safe monthly saving capacity!';

  if (inc === 0) {
    healthStatus = 'unconfigured';
    message = 'Add your income and expense details to verify your safe saving capacity.';
  } else if (committed > safeDisposableCapacity) {
    healthStatus = 'overstretched';
    message = `Overcommitted by ${formatCurrency(committed - safeDisposableCapacity)}/month! Saving this much may dip into essentials or emergency reserves.`;
  } else if (utilizationRatio > 85) {
    healthStatus = 'tight';
    message = 'Saving at near-maximum capacity (over 85%). Ensure you have buffer for unexpected expenses.';
  }

  return {
    income: inc,
    totalFixedCosts,
    safeDisposableCapacity,
    committed,
    remainingCushion,
    utilizationRatio: Math.min(100, Math.round(utilizationRatio)),
    healthStatus,
    message
  };
}
