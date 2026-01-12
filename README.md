<p align="center">
  <img src="public/assets/hackcourt-logo.png" width="360" />
</p>

<h1 align="center">⚖️ HackCourt</h1>

<p align="center">
  <b>Where technical arguments go to court.</b><br/>
  An AI-powered judicial engine for hackathon decision-making.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI-Groq-black?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Mode-Compare%20%7C%20Advisory-purple?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Fallback-Deterministic-green?style=for-the-badge"/>
</p>

---

## 🧠 What is HackCourt?

HackCourt is a **technical decision courtroom**.

Instead of teams arguing endlessly over stacks, frameworks, or architecture, HackCourt:
- hears both sides,
- applies judicial philosophy,
- evaluates evidence,
- and delivers a **final ruling**.

No vibes. No opinions. Just structured verdicts.

---

## ⚖️ Modes of Operation

### 🔹 Compare Mode
Present two competing technical approaches.

HackCourt delivers:
- A clear winner
- Confidence level
- **Exactly 3 evidence-backed trade-offs**
- Judicial warnings when risk is involved

Perfect for:
- Framework disputes
- Architecture decisions
- “This vs That” debates

---

### 🔹 Advisory Mode
Ask the court for technical counsel.

HackCourt delivers:
- A recommended stack
- Justification
- **3 supporting trade-offs**
- Explicitly rejected alternatives

Perfect for:
- Early-stage planning
- Uncertain teams
- Time-constrained hackathons

---

## 👩‍⚖️ Judicial Philosophy

HackCourt simulates *real judicial disagreement*.

### Hon. Justice Reliability
- Prefers proven, stable technology
- Penalizes novelty and complexity
- Optimized for risk minimization

### Hon. Justice Innovation
- Prefers modern tooling and demo impact
- Accepts calculated risk
- Optimized for presentation and differentiation

Same case. Different judge. Different ruling.  
By design.

---

## 🤖 AI Architecture (Disciplined by Law)

HackCourt is **AI-first but not AI-dependent**.

```bash
Groq AI
↓
Strict Validation
↓
Normalization
↓
Deterministic Fallback
```

If AI output violates contract rules, the system **automatically rejects it** and falls back to deterministic logic.

No broken UI. No hallucinated data.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript, HTML, CSS  
- **AI:** Groq API  
- **Architecture:** Frontend-only, zero backend  
- **Safety:** Deterministic fallback engines  

---

## 🚀 Why HackCourt?

Hackathons don’t fail because of bad ideas.  
They fail because teams can’t agree.

HackCourt:
- Saves time
- Forces clarity
- Makes trade-offs explicit
- Lets teams build instead of debate

---

## 🧠 Powered by Kiro

Kiro accelerated:
- AI schema design
- Strict mode separation
- Evidence enforcement
- Judge philosophy consistency
- Runtime bug elimination
- Clean fallback architecture

This project shipped because of **fast, disciplined iteration**, not guesswork.
---
Fantastic. The chaos deserves documentation. Here’s a **drop-in README section** you can paste under something like **“🚀 Running HackCourt Locally”**.

---

## 🚀 Running HackCourt Locally

HackCourt is frontend-only. No backend. No database. No mercy.
If you can open a browser, you can run this.

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/HackCourt.git
cd HackCourt
```

### 2️⃣ Create the config file (important, don’t skip)

HackCourt **does not ship with an API key** because GitHub would (rightfully) lose its mind.

Create this file:

```
public/config.js
```

Paste this exactly:

```js
// HackCourt Configuration
// This file contains configuration settings for the HackCourt application

window.HACKCOURT_CONFIG = {
    // Groq API key for AI-powered decision making
    // Set this to your Groq API key to enable AI features
    // If null, the application will fall back to deterministic decision making
    GROQ_API_KEY: "API_KEY_HERE"
};
```

Replace `"API_KEY_HERE"` with your actual **Groq API key**.

No key?

* HackCourt still works
* It automatically falls back to deterministic judge logic
* The AI just silently steps aside like a professional

### 3️⃣ Serve the app

You can use **anything** that serves static files.

#### Option A: npx serve (recommended)

```bash
npx serve public
```

#### Option B: VS Code Live Server

Right-click `public/index.html` → **Open with Live Server**

#### Option C: Raw HTML (it works, but be civil)

Open `public/index.html` directly in your browser
(Some browsers may block fetch calls. If something feels cursed, use A or B.)

### 4️⃣ Open in browser

Go to:

```
http://localhost:3000
```

(or whatever port your server tthrows at you)

### 5️⃣ Verify AI is working (optional flex)

* Submit a case
* Open DevTools → Console
* If you see **“AI Engine: Groq response validated successfully”**

Congratulations. You summoned the judges.

---

## 📜 License

MIT.  
Court rulings are final, but the code is free.

---

<p align="center">
  <b>Court is adjourned.</b> ⚖️
</p>
