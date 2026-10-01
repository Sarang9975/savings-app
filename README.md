# GoalCast 🧭 — Smart Savings Planner & Cashflow GPS

> An intelligent, production-grade financial planning engine designed for variable income earners, creators, and freelancers. Accurately predicts purchase readiness dates, factors 6% annual compound growth, and solves Problem Statement No. 12 with zero-slop craftsmanship.

![GoalCast Preview](public/favicon.svg)

---

## 🎯 Problem Statement No. 12 Solution

> *"I want to buy a phone, laptop, or bike, so I need a plan for saving. Let me type what I want to buy, its price, how much I have already saved, and how much I can save each month. It should tell after how many months I can buy it, and in which month and year. If the monthly saving is 0, it should say something. Multiple goals should be possible, and maybe the goals can be ranked in order of what to buy first. A progress bar for each. Interest is not needed, but add 6% yearly interest."*

### Key Solution Highlights:
1. **Target Date & Duration Engine**: Accurately computes remaining runway, exact milestone completion month & year, and duration in months.
2. **6% Yearly Compound Growth**: Models compounding interest on accumulated balances, showing users the exact accelerated timeline gained from yield.
3. **Zero-Saving Safety Guard**: Diagnoses ₹0/month allocations with proactive warnings and 1-click recovery actions instead of static NaN crashes.
4. **Sequential Priority Reordering**: Up/down reordering with visual priority hierarchy (`#1 Top Priority` through `#N`).
5. **Interactive Monthly Allocation**: Sliders and +/- ₹1,000 steppers directly on each goal card for instant recalculation.

---

## 🚀 Advanced Capabilities

- **Variable Income Modeling**: Probability-weighted income streams (Recurring, Freelance, Opportunities) with gross vs risk-adjusted expected returns.
- **Bank Data Connect (Sandbox)**: Connect Setu / Finvu Account Aggregator mock flow or upload bank statements to automatically calibrate balances.
- **Client-Side AI & NLP**: Browser-based zero-shot extraction using `Xenova/nli-deberta-v3-xsmall` via Transformers.js for natural language goal and income parsing.
- **Anti-Slop Production Design**: Designed in accordance with [Taste Skill](https://www.tasteskill.dev/) and modern component standards ([21st.dev](https://21st.dev/), [Skiper UI](https://skiper-ui.com/)). Clean dark zinc surfaces, crisp 1px borders, and zero neon lighting.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Vanilla CSS Design Tokens (Anti-Slop, Dark Obsidian theme, Inter + JetBrains Mono)
- **Icons**: Lucide React
- **ML / AI**: `@huggingface/transformers` (In-browser ONNX runtime)
- **Effects**: `canvas-confetti`

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/Sarang9975/savings-app.git
cd savings-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License

MIT © [Sarang](https://github.com/Sarang9975)
