# Design System & UI Guidelines: GraphSentinel

This document defines the visual identity, styling rules, and component standards for the GraphSentinel dashboard. The goal is to create a "Cyberpunk FinTech / Mission Control" aesthetic. It must look like a high-end, real-time threat radar used by elite security analysts.  
---

## 1\. Overall Visual Style (The "Vibe")

* Theme: Strict Dark Mode. Light mode is not supported.  
* Aesthetic: "Glassmorphism" meets "Data Terminal". Panels should have subtle transparency, deep backgrounds, and glowing accents.  
* Background: A very dark, rich slate/blue-black with a faint, subtle grid pattern to emphasize the "network/graph" theme.  
* Depth: Use subtle borders and background blurs to separate panels from the background, rather than heavy drop shadows.

---

## 2\. Color Palette

### Backgrounds & Surfaces

* Main Background: bg-slate-950 (Deep, rich dark blue-black. Never use pure \#000000).  
* Panel/Card Background: bg-slate-900/80 (Slightly lighter, with 80% opacity for a subtle glass effect).  
* Borders: border-slate-800 (Very subtle, thin borders to define edges).

### Primary & Brand Colors (The "Good" AI)

* Primary (Brand/Action): text-cyan-400 / bg-cyan-500 (Electric Cyan). Used for primary buttons, active states, and the AI Agent's "thinking" text.  
* Primary Glow: shadow-\[0\_0\_15px\_rgba(34,211,238,0.3)\] (Subtle cyan glow on primary elements).

### Semantic Colors (Data & Threats)

* Danger / Threat: text-rose-500 / bg-rose-500 (Neon Red). Used for wash-trading nodes, high threat scores, and attack alerts.  
* Warning: text-amber-400 (Amber). Used for medium threat scores or pending states.  
* Success / Safe: text-emerald-400 (Neon Green). Used for normal trading nodes, successful defenses, and bounty payouts.

### Typography Colors

* Primary Text: text-slate-100 (Off-white, easy on the eyes).  
* Secondary Text: text-slate-400 (Muted gray for labels, timestamps, and secondary info).

---

## 3\. Fonts and Typography

We use a combination of a clean geometric sans-serif for UI and a monospace font for data/terminal elements.

* UI & Headings: Inter (Standard, clean, highly readable).  
  * H1 (Page Titles): text-2xl font-bold tracking-tight text-slate-100  
  * H2 (Panel Titles): text-lg font-semibold text-slate-200 uppercase tracking-wider  
* Data, Numbers & Terminal: JetBrains Mono or Fira Code (Crucial for the "hacker/analyst" feel).  
  * Threat Scores, Wallet Addresses, Terminal Logs: font-mono text-sm

---

## 4\. UI Components & Styling Rules

### A. Cards / Panels (The Containers)

Every major section of the dashboard (Graph, Terminal, Heatmap) should be wrapped in a standard panel component.

* Styling: bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-6  
* Header: Every panel must have a header with a title and a small status indicator dot (e.g., a pulsing green dot for "Live").

### B. Buttons

* Primary Action (e.g., "Connect Wallet", "Deploy Agent"):  
  * bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-2 px-4 rounded-lg transition-all shadow-\[0\_0\_15px\_rgba(34,211,238,0.2)\] hover:shadow-\[0\_0\_20px\_rgba(34,211,238,0.4)\]  
* Secondary/Destructive:  
  * bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-2 px-4 rounded-lg

### C. The Agent Terminal (Crucial for the Demo)

This must look like a real, active command-line interface.

* Background: bg-black border border-slate-800 rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto  
* Text Colors:  
  * System prompts: text-slate-500  
  * Agent actions: text-cyan-400  
  * Threat alerts: text-rose-500 font-bold  
  * Success messages: text-emerald-400

### D. Data Visualizations (Graph & Heatmaps)

* Network Graph Nodes:  
  * Normal: fill-cyan-500 with a slight glow.  
  * Suspicious: fill-amber-400.  
  * Attack: fill-rose-500 with a pulsing animation.  
* GAF Heatmaps: Displayed inside a standard Panel. Add a subtle border and a small label in the top right corner showing the CNN confidence score.

---

## 5\. Spacing and Layout (The Grid)

The dashboard should use a strict, responsive grid to look organized and professional.

* Global Layout:  
  * Sidebar (Left): Fixed width (w-64), contains navigation and protocol stats.  
  * Main Content (Right): Flex-grow, contains the main dashboard grid.  
* Dashboard Grid (Main Content):  
  * Use CSS Grid: grid grid-cols-12 gap-6.  
  * Top Row: 3 small stat cards (Total Value Protected, Attacks Blocked, AI Bounties Paid) spanning 4 columns each.  
  * Middle Row:  
    * Left: Network Graph (spans 8 columns, tall).  
    * Right: Agent Terminal (spans 4 columns, tall).  
  * Bottom Row: GAF Heatmap Viewer (spans 6 columns) and Recent Threat Log (spans 6 columns).  
* Internal Spacing: Always use p-6 (24px) for padding inside panels, and gap-4 or gap-6 between elements to let the data breathe.

---

## 6\. AI Generation Instructions (For Copilot/Cursor/v0)

When generating React/Tailwind code for this project, the AI must strictly adhere to these rules:

1. Never use pure black (bg-black) for main backgrounds. Always use bg-slate-950 or bg-slate-900.  
2. Always use the font-mono class for wallet addresses (e.g., 0x123...), threat scores (e.g., 94.2%), and terminal text.  
3. Do not use standard HTML alerts. Use custom-styled div elements with the semantic colors defined above (e.g., a red border and background for alerts).  
4. Add subtle animations. Use Tailwind's animate-pulse for live status dots and threat nodes to make the dashboard feel "alive" during the pitch.  
5. Use backdrop-blur-md on all main panels to achieve the required glassmorphism effect against the dark background.

Copy  
Ask Qwen  
Explain  
Translate(en-US)

* 

