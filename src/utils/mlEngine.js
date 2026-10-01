/**
 * GoalCast ML Engine — Powered by Transformers.js (Hugging Face)
 *
 * Uses Xenova/nli-deberta-v3-xsmall for zero-shot classification.
 * Runs fully offline in the browser — no API key, no server.
 *
 * Features:
 * 1. classifyGoal(text)     → auto-extract category, urgency, importance, estimated price
 * 2. classifyIncome(text)   → auto-classify income type, confidence probability
 * 3. analyzeSentiment(text) → financial risk posture (optimistic / cautious / stressed)
 */

let pipeline = null;
let pipelineLoading = false;
let pipelineReady = false;

// Progress callback type: (pct: number, status: string) => void
let onProgress = null;

export function setProgressCallback(cb) {
  onProgress = cb;
}

export function isPipelineReady() {
  return pipelineReady;
}

async function getPipeline() {
  if (pipeline) return pipeline;
  if (pipelineLoading) {
    // Poll until ready
    return new Promise((resolve, reject) => {
      const check = setInterval(() => {
        if (pipelineReady && pipeline) {
          clearInterval(check);
          resolve(pipeline);
        }
      }, 200);
      setTimeout(() => { clearInterval(check); reject(new Error('Pipeline load timeout')); }, 60000);
    });
  }

  pipelineLoading = true;

  const { pipeline: createPipeline, env } = await import('@huggingface/transformers');

  // Allow local model caching via browser cache (IndexedDB/Cache API)
  env.allowLocalModels = false;
  env.useBrowserCache = true;

  if (onProgress) onProgress(5, 'Initializing Transformers.js runtime...');

  pipeline = await createPipeline(
    'zero-shot-classification',
    'Xenova/nli-deberta-v3-xsmall',
    {
      progress_callback: (info) => {
        if (onProgress && info.status === 'downloading' && info.total) {
          const pct = Math.round((info.loaded / info.total) * 90) + 5;
          const mb = (info.loaded / 1048576).toFixed(1);
          const totalMb = (info.total / 1048576).toFixed(1);
          onProgress(pct, `Downloading model: ${mb}MB / ${totalMb}MB`);
        }
      }
    }
  );

  pipelineReady = true;
  pipelineLoading = false;

  if (onProgress) onProgress(100, 'ML engine ready!');
  return pipeline;
}

// ──────────────────────────────────────────────────
// 1. GOAL CLASSIFIER
// Input: "I need a gaming laptop for my college"
// Output: { category, urgency, importance, priceHint, priceRange }
// ──────────────────────────────────────────────────
export async function classifyGoal(text) {
  const clf = await getPipeline();

  // Category classification
  const categoryResult = await clf(text, [
    'laptop or computer', 'mobile phone or smartphone', 'motorcycle or bike',
    'gaming console or gaming setup', 'travel or vacation', 'camera or photography gear',
    'tablet or iPad', 'smartwatch or wearable', 'car or vehicle', 'other purchase'
  ], { multi_label: false });

  const topCategory = categoryResult.labels[0];
  const topScore = categoryResult.scores[0];

  // Urgency classification
  const urgencyResult = await clf(text, [
    'urgent and time-sensitive', 'moderate priority', 'low priority or flexible'
  ], { multi_label: false });

  const urgencyLabel = urgencyResult.labels[0];

  // Importance/Necessity classification
  const importanceResult = await clf(text, [
    'essential and critical for work or study', 'important and useful', 'nice to have but not necessary'
  ], { multi_label: false });

  const importanceLabel = importanceResult.labels[0];

  // Price hint from category
  const priceHints = {
    'laptop or computer': { min: 40000, max: 160000, default: 80000, label: '₹40,000 – ₹1,60,000' },
    'mobile phone or smartphone': { min: 15000, max: 130000, default: 70000, label: '₹15,000 – ₹1,30,000' },
    'motorcycle or bike': { min: 80000, max: 250000, default: 120000, label: '₹80,000 – ₹2,50,000' },
    'gaming console or gaming setup': { min: 30000, max: 80000, default: 50000, label: '₹30,000 – ₹80,000' },
    'travel or vacation': { min: 20000, max: 100000, default: 40000, label: '₹20,000 – ₹1,00,000' },
    'camera or photography gear': { min: 25000, max: 150000, default: 70000, label: '₹25,000 – ₹1,50,000' },
    'tablet or iPad': { min: 30000, max: 90000, default: 55000, label: '₹30,000 – ₹90,000' },
    'smartwatch or wearable': { min: 8000, max: 50000, default: 25000, label: '₹8,000 – ₹50,000' },
    'car or vehicle': { min: 500000, max: 2000000, default: 800000, label: '₹5,00,000 – ₹20,00,000' },
    'other purchase': { min: 10000, max: 100000, default: 50000, label: '₹10,000 – ₹1,00,000' }
  };

  const price = priceHints[topCategory] || priceHints['other purchase'];

  // Map labels to structured output
  const categoryMap = {
    'laptop or computer': 'Laptop',
    'mobile phone or smartphone': 'Phone',
    'motorcycle or bike': 'Bike',
    'gaming console or gaming setup': 'Gaming',
    'travel or vacation': 'Travel',
    'camera or photography gear': 'Camera',
    'tablet or iPad': 'Tablet',
    'smartwatch or wearable': 'Wearable',
    'car or vehicle': 'Vehicle',
    'other purchase': 'General'
  };

  const urgencyMap = {
    'urgent and time-sensitive': 'high',
    'moderate priority': 'medium',
    'low priority or flexible': 'low'
  };

  const importanceMap = {
    'essential and critical for work or study': 5,
    'important and useful': 4,
    'nice to have but not necessary': 2
  };

  const iconMap = {
    'Laptop': '💻', 'Phone': '📱', 'Bike': '🏍️', 'Gaming': '🎮',
    'Travel': '✈️', 'Camera': '📷', 'Tablet': '📟', 'Wearable': '⌚',
    'Vehicle': '🚗', 'General': '🎯'
  };

  const category = categoryMap[topCategory] || 'General';
  const urgency = urgencyMap[urgencyLabel] || 'medium';
  const importance = importanceMap[importanceLabel] || 3;

  return {
    category,
    icon: iconMap[category],
    urgency,
    importance,
    priceDefault: price.default,
    priceRange: price.label,
    priceMin: price.min,
    priceMax: price.max,
    confidence: Math.round(topScore * 100),
    rawCategory: topCategory
  };
}

// ──────────────────────────────────────────────────
// 2. INCOME STREAM CLASSIFIER
// Input: "I might win the national AI hackathon next month"
// Output: { type, probability, reasoning }
// ──────────────────────────────────────────────────
export async function classifyIncomeStream(text) {
  const clf = await getPipeline();

  // Type classification
  const typeResult = await clf(text, [
    'regular salary or fixed monthly payment',
    'freelance project or client work',
    'competition prize or hackathon winning',
    'bonus or incentive payment',
    'referral or commission income'
  ], { multi_label: false });

  const topType = typeResult.labels[0];
  const topScore = typeResult.scores[0];

  // Certainty level
  const certaintyResult = await clf(text, [
    'already confirmed and guaranteed',
    'likely to happen with good confidence',
    'possible but uncertain',
    'very speculative and unlikely'
  ], { multi_label: false });

  const certaintyLabel = certaintyResult.labels[0];

  const typeMap = {
    'regular salary or fixed monthly payment': 'recurring',
    'freelance project or client work': 'freelance',
    'competition prize or hackathon winning': 'opportunity',
    'bonus or incentive payment': 'opportunity',
    'referral or commission income': 'freelance'
  };

  const probabilityMap = {
    'already confirmed and guaranteed': 95,
    'likely to happen with good confidence': 70,
    'possible but uncertain': 35,
    'very speculative and unlikely': 12
  };

  const reasoningMap = {
    'already confirmed and guaranteed': 'This income appears confirmed — treated as near-certain cashflow.',
    'likely to happen with good confidence': 'This looks likely. Assigned 70% probability — strong but not guaranteed.',
    'possible but uncertain': 'This is possible but depends on external factors. Using 35% probability.',
    'very speculative and unlikely': 'This is speculative. Only ₹0.12 expected for every ₹1 of potential. Factor carefully.'
  };

  return {
    type: typeMap[topType] || 'freelance',
    probability: probabilityMap[certaintyLabel] || 50,
    reasoning: reasoningMap[certaintyLabel] || 'Moderate confidence applied.',
    confidence: Math.round(topScore * 100),
    rawType: topType
  };
}

// ──────────────────────────────────────────────────
// 3. FINANCIAL STRESS ANALYZER
// Input: "I'm really worried about my bills next month"
// Output: { posture, label, advice }
// ──────────────────────────────────────────────────
export async function analyzeFinancialPosture(text) {
  const clf = await getPipeline();

  const postureResult = await clf(text, [
    'financially optimistic and confident',
    'financially cautious and realistic',
    'financially stressed and worried',
    'financially uncertain and confused'
  ], { multi_label: false });

  const topPosture = postureResult.labels[0];

  const postureConfig = {
    'financially optimistic and confident': {
      posture: 'optimistic',
      label: '🚀 Optimistic Saver',
      color: '#10b981',
      advice: 'Your confidence is an asset! Consider stretching for higher-value goals — your momentum supports it.',
      riskBias: 'use Optimistic scenario as primary ETA'
    },
    'financially cautious and realistic': {
      posture: 'cautious',
      label: '🛡️ Cautious Planner',
      color: '#38bdf8',
      advice: 'Solid approach. Plan with the Expected scenario and track your pipeline monthly.',
      riskBias: 'use Expected scenario as primary ETA'
    },
    'financially stressed and worried': {
      posture: 'stressed',
      label: '⚠️ Under Pressure',
      color: '#f59e0b',
      advice: 'Reduce goal count to 1–2 priorities. Small wins build momentum. Consider the ₹0 Blackout check to find your minimum required monthly saving.',
      riskBias: 'use Conservative scenario as primary ETA'
    },
    'financially uncertain and confused': {
      posture: 'uncertain',
      label: '🌫️ Needs Clarity',
      color: '#a855f7',
      advice: 'Start by filling your Income Pipeline with even rough estimates — the forecast will reduce uncertainty quickly.',
      riskBias: 'use Conservative scenario as primary ETA'
    }
  };

  return postureConfig[topPosture] || postureConfig['financially cautious and realistic'];
}
