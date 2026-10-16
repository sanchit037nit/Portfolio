# ⚡ Sanchit Virdi — Modern Portfolio Website

> **High-Performance Portfolio for Frontend & Systems Software Engineering**  
> Tailored for high-bar engineering roles (real-time data, WebSockets, quantitative systems, and scalable full-stack applications).

---

## 🚀 Live Preview & Running Locally

The portfolio is built with modern **Vanilla JavaScript (ES6+), HTML5, and bespoke Glassmorphic Vanilla CSS** with **zero build step dependencies** for instant loading and 60-120 FPS render performance.

### Quick Run
```bash
# Using Python
python -m http.server 4173

# Or using Node.js / npx
npx serve .
```
Then navigate to: `http://localhost:4173/`

---

## ✨ Key Portfolio Features & Modules

1. **Interactive Real-Time Lab**:
   - Simulated sub-millisecond WebSocket streaming market data feed (configurable from 50ms turbo to 500ms).
   - Live Order Book depth with animated bids (emerald green) and asks (crimson red).
   - Double-buffered HTML5 Canvas price plotting with crosshair inspection and zero dropped frames.
   - Live Telemetry HUD: Real-time FPS monitor, frame-render time tracking, tick ingestion counter.
   - Market Surge Benchmark: Ingests 50 ticks in rapid bursts to demonstrate zero-stutter UI resilience.

2. **Featured Systems & Applications**:
   - **Codezy**: Collaborative code rooms with Socket.io, Monaco Editor, AES-256 encryption, deployed on Vercel (`https://services-ten-ashy.vercel.app/`).
   - **ARO-LSTM Pairs Trading**: Quantitative statistical arbitrage strategy with Johansen cointegration, ADF stationarity, and LSTM signal forecasting.
   - **High-Concurrency Distributed Flight Booking Engine**: Solves race conditions with MySQL row-level `SELECT ... FOR UPDATE` locks, Redis distributed caching, and message queues.
   - **ScholarSync**: Multi-source AI platform with &lt; 50ms deterministic matching and sub-millisecond SSR payload extraction.
   - **UPI Real-Time Fraud Detection**: 94.9% ROC-AUC Random Forest ML classifier with Streamlit auditing UI.
   - **RandomPass**: Browser Web Crypto API key generator deployed on Vercel (`https://ranpass.vercel.app/`).

3. **Engineering Philosophy & Architecture**:
   - Interactive deep-dive tabs explaining 16ms frame budgeting, WebSocket exponential backoff with jitter, atomic state selectors (Zustand), and ACID transaction concurrency.

4. **Interactive CLI Developer Console**:
   - Hotkey `⌘K` / `Ctrl+K` to open the in-browser terminal.
   - Supports commands: `help`, `bio`, `projects`, `skills`, `fintech`, `hire`, `contact`, `github`, `clear`.

5. **Quick Resume Preview & Native Print**:
   - In-browser formatted resume preview modal with print/save as PDF stylesheet formatting.

6. **Design Aesthetics & Controls**:
   - Curated obsidian dark palette (`#06080d`) with electric cyan (`#00f2fe`) and neon emerald (`#10b981`) accents.
   - Seamless Dark / Light mode toggle with `localStorage` persistence.
   - Native Web Audio API sound effect synthesis (no external MP3 files needed).
   - Ambient geometric canvas particle network reacting to cursor presence.

---

## 📦 Deployment

### Deploy to Vercel (1 click)
```bash
npx vercel --prod
```

### Deploy to GitHub Pages
1. Go to repository **Settings** -> **Pages**.
2. Select branch `main` and root directory `/`.
3. Save and your portfolio will be live at `https://sanchit037nit.github.io/Portfolio`.

---

## 👤 Author

**Sanchit Virdi**  
- **Email:** [10dsanchitbis.virdi@gmail.com](mailto:10dsanchitbis.virdi@gmail.com)  
- **GitHub:** [@sanchit037nit](https://github.com/sanchit037nit)  
- **Education:** B.Tech in Computer Science & Engineering (Class of 2027), National Institute of Technology (NIT)  
- **Research Experience:** Ex-Research Intern, Indian Institute of Technology (IIT) Jammu (Machine Learning & Systems)
