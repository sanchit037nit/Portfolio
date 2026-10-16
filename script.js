/**
 * SANCHIT VIRDI — PORTFOLIO CORE CONTROLLER & REAL-TIME ENGINE
 * Features: High-frequency data simulation, Canvas chart, CLI terminal, Architecture modals, Web Audio
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. STATE & GLOBAL CONFIGURATION
  // =========================================================================
  const state = {
    theme: localStorage.getItem('sv_theme') || 'dark',
    soundEnabled: localStorage.getItem('sv_sound') !== 'false',
    symbol: 'NIFTY',
    tickSpeed: 100, // ms
    isStreaming: true,
    streamTimer: null,
    totalTicks: 1482,
    droppedFrames: 0,
    fps: 60,
    lastFrameTime: performance.now(),
    frameCount: 0,
    chartData: [],
    maxChartPoints: 60,
    currentPrice: 24850.40,
    basePrice: 24402.20,
    audioCtx: null
  };

  // Symbols data definitions
  const symbolsMeta = {
    NIFTY: { name: 'NIFTY 50', base: 24402.20, current: 24850.40, currency: '₹', spread: 0.05, step: 0.25 },
    BTC: { name: 'BTC / USDT', base: 65100.00, current: 67420.00, currency: '$', spread: 0.50, step: 1.00 },
    ETH: { name: 'ETH / USDT', base: 3450.00, current: 3580.20, currency: '$', spread: 0.10, step: 0.10 },
    TECH: { name: 'TECH500', base: 18500.00, current: 18920.80, currency: '$', spread: 0.20, step: 0.50 }
  };

  // Architecture data for Modals
  const architectureData = {
    codezy: {
      icon: '💬',
      title: 'Codezy — Real-Time Developer Platform & Collaborative Rooms',
      subtitle: 'Production React 19 Full-Stack System • Deployed on Vercel',
      content: `
        <h4>1. The Problem</h4>
        <p>Developers practicing competitive programming (LeetCode, Codeforces) lack a dedicated collaborative environment to discuss problems in real time, review annotated solutions, and receive automated notifications for upcoming contests.</p>
        
        <h4>2. Architecture & Real-Time Flow</h4>
        <p>Codezy uses an event-driven architecture combining <strong>React 19, Node.js, Express, Socket.io, and MongoDB</strong>. Real-time collaborative rooms allow multiple engineers to write and inspect code synchronously with the embedded <strong>Monaco Editor</strong> (the engine powering VS Code).</p>
        <ul>
          <li><strong>WebSockets / Socket.io:</strong> Room-scoped socket namespaces prevent cross-talk, distributing cursor positions and keystrokes with debounced delta sync.</li>
          <li><strong>AES-256 Encryption:</strong> Private code solutions are encrypted client-to-database, ensuring absolute privacy for proprietary interview preparations.</li>
          <li><strong>Zustand State Store:</strong> Atomic selectors prevent expensive editor re-renders during active keystroke broadcasting.</li>
        </ul>

        <h4>3. Key Metrics & Links</h4>
        <p><strong>Live Demo:</strong> <a href="https://services-ten-ashy.vercel.app/" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">https://services-ten-ashy.vercel.app/</a><br>
        <strong>GitHub Repository:</strong> <a href="https://github.com/sanchit037nit/Codezy" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/sanchit037nit/Codezy</a></p>
      `
    },
    arolstm: {
      icon: '📈',
      title: 'ARO-LSTM Pairs Trading & Statistical Arbitrage Engine',
      subtitle: 'Quantitative Modeling • Cointegration & Neural Signal Forecasting',
      content: `
        <h4>1. Quantitative Philosophy</h4>
        <p>Pairs trading is a market-neutral statistical arbitrage strategy. When two cointegrated assets drift away from their historical equilibrium spread, we short the overpriced leg and long the underpriced leg, capturing profits upon mean-reversion.</p>

        <h4>2. Mathematical & Algorithmic Pipeline</h4>
        <ul>
          <li><strong>Johansen Cointegration & ADF Tests:</strong> Statistically validates stationarity and long-term equilibrium vectors across asset pairs.</li>
          <li><strong>LSTM Sequence Neural Network:</strong> Trained on rolling windowed price spreads to forecast next-day deviation signals.</li>
          <li><strong>ARO (Artificial Rabbits Optimization):</strong> Metaheuristic search tuning model hyperparameters and decision thresholds.</li>
          <li><strong>Hedge-Ratio Capital Sizing:</strong> Dynamically balances portfolio weightings to guarantee market neutrality.</li>
        </ul>

        <h4>3. Results & Source Code</h4>
        <p>Evaluated using RMSPE and historical backtesting metrics.<br>
        <strong>GitHub Repository:</strong> <a href="https://github.com/sanchit037nit/-ARO-LSTM-Pairs-Trading" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/sanchit037nit/-ARO-LSTM-Pairs-Trading</a></p>
      `
    },
    scholarsync: {
      icon: '🎓',
      title: 'ScholarSync — Multi-Source Ingestion & Deterministic Matcher',
      subtitle: 'Sub-Millisecond Payload Extraction • Groq LPU Inference',
      content: `
        <h4>1. The Challenge</h4>
        <p>Indian scholarship data is fragmented across dozens of unstandardized state portals and complex PDF circulars. Students need instant, verified matches without wading through expired listings.</p>

        <h4>2. Technical Innovations</h4>
        <ul>
          <li><strong>3-Tier Extraction Engine:</strong> Tier 1 deserializes Next.js SSR payloads in &lt; 1ms; Tier 2 falls back to Groq LPU AI inference; Tier 3 employs robust local regex heuristics.</li>
          <li><strong>Sub-50ms Deterministic Matcher:</strong> Written in pure Express.js/Node to calculate eligibility vectors across 6 core criteria in under 50ms without external roundtrips.</li>
          <li><strong>Stemmed Token Deduplication:</strong> Overlap coefficient ($\ge 75\%$) deduplicates redundant listings and prioritizes official <code>.gov.in</code> URLs.</li>
          <li><strong>Circuit Breaker:</strong> <code>Promise.allSettled()</code> safeguards the ingestion pipeline so external portal outages never break catalogue availability.</li>
        </ul>

        <h4>3. Repository</h4>
        <p><strong>GitHub:</strong> <a href="https://github.com/sanchit037nit/ScholarSync" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/sanchit037nit/ScholarSync</a></p>
      `
    },
    flight: {
      icon: '🛫',
      title: 'High-Concurrency Distributed Flight Booking Engine',
      subtitle: 'System Design • MySQL ACID Locks • Redis Cache & Rate Limiting',
      content: `
        <h4>1. Engineering Focus: Concurrency & Zero Overselling</h4>
        <p>Handling thousands of simultaneous user requests attempting to reserve the exact same seat during high-demand flight booking flash sales.</p>

        <h4>2. Architecture Decisions</h4>
        <ul>
          <li><strong>Pessimistic Row-Level Locking:</strong> Uses MySQL <code>SELECT ... FOR UPDATE</code> inside explicit database transactions, guaranteeing that two concurrent requests cannot book the same seat.</li>
          <li><strong>Redis Caching:</strong> Sub-5ms read queries for flight routes and pricing, with intelligent stale-while-revalidate invalidation upon booking commits.</li>
          <li><strong>Token-Bucket Distributed Rate Limiting:</strong> Enforced at the gateway layer to throttle bots and malicious traffic.</li>
          <li><strong>Decoupled Asynchronous Workers:</strong> Message queue pattern separates immediate booking confirmation from non-blocking ticket email/SMS notification pipelines.</li>
        </ul>

        <h4>3. Repository</h4>
        <p><strong>GitHub:</strong> <a href="https://github.com/sanchit037nit/System-Design-High-Concurrency-Flight-Booking-System" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/sanchit037nit/System-Design-High-Concurrency-Flight-Booking-System</a></p>
      `
    },
    upi: {
      icon: '💳',
      title: 'UPI Real-Time Fraud Detection Platform',
      subtitle: 'Machine Learning • Random Forest • Interactive Auditing Dashboard',
      content: `
        <h4>1. The Domain</h4>
        <p>Unified Payments Interface (UPI) handles billions of financial transactions monthly. Real-time detection requires binary classification capable of predicting fraud with extreme precision to prevent false positives.</p>

        <h4>2. Machine Learning Pipeline</h4>
        <ul>
          <li><strong>Tuned Random Forest:</strong> Achieved <strong>94.9% ROC-AUC</strong> and ~0.95 F1-Score on highly skewed imbalanced transaction datasets.</li>
          <li><strong>Feature Engineering:</strong> Extracted behavioral velocity indicators, device trust scores, and temporal deviation patterns.</li>
          <li><strong>Sub-Millisecond Inference:</strong> Serialized model allows inline authorization checks without noticeable user latency.</li>
          <li><strong>Streamlit Dashboard:</strong> Interactive web portal for single-transaction audits and bulk CSV batch scoring.</li>
        </ul>

        <h4>3. Repository</h4>
        <p><strong>GitHub:</strong> <a href="https://github.com/sanchit037nit/UPI-Fraud-Detection-Using-Machine-Learning" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/sanchit037nit/UPI-Fraud-Detection-Using-Machine-Learning</a></p>
      `
    },
    ranpass: {
      icon: '🔐',
      title: 'RandomPass — Client-Side Entropy Generator',
      subtitle: 'Cryptographic Security • Web Crypto API • Vercel Edge',
      content: `
        <h4>1. True Client-Side Cryptography</h4>
        <p>Built to solve insecure password generation by using the browser's native <code>window.crypto.getRandomValues()</code> CSPRNG (Cryptographically Secure Pseudorandom Number Generator) with zero server-side telemetry or logging.</p>

        <h4>2. Highlights</h4>
        <ul>
          <li>Generates mathematically unguessable passwords, tokens, and cryptographic keys.</li>
          <li>Entropy calculation meter based on character pool diversity and Shannon entropy.</li>
          <li>Zero external dependencies, instant copy feedback, and accessible mobile layout.</li>
        </ul>

        <h4>3. Links</h4>
        <p><strong>Live Demo:</strong> <a href="https://ranpass.vercel.app" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">https://ranpass.vercel.app</a><br>
        <strong>GitHub:</strong> <a href="https://github.com/sanchit037nit/random-pass" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/sanchit037nit/random-pass</a></p>
      `
    },
    genai: {
      icon: '✨',
      title: 'GenAI Studio — Intelligent Prompt & Creative Workspace',
      subtitle: 'React 19 • Vite • Zustand • Multi-Model LLM Ingestion Pipeline',
      content: `
        <h4>1. Platform Vision</h4>
        <p>A responsive generative AI workspace built to provide seamless, low-latency streaming interactions with modern Large Language Models without UI stuttering or main thread lockups.</p>

        <h4>2. Architecture & Implementation</h4>
        <ul>
          <li><strong>Optimized Token Streaming:</strong> Server-Sent Events (SSE) and chunk-by-chunk buffer decoding stream LLM tokens smoothly into the view hierarchy with zero layout thrashing.</li>
          <li><strong>Zustand Store Decoupling:</strong> Decouples prompt iteration history, parameter controls (temperature, top-p), and token generation queues from view re-renders.</li>
          <li><strong>Micro-Animation Engine:</strong> Motion feedback and reactive states communicate prompt status (queued, streaming, complete, token-rate telemetry).</li>
        </ul>

        <h4>3. Repository</h4>
        <p><strong>GitHub:</strong> <a href="https://github.com/sanchit037nit/GenAI-Project" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/sanchit037nit/GenAI-Project</a></p>
      `
    },
    movierec: {
      icon: '🎬',
      title: 'Content-Based Movie Recommendation Engine',
      subtitle: 'Machine Learning • Vector Space Modeling • Cosine Distance',
      content: `
        <h4>1. Machine Learning Modeling</h4>
        <p>A content-based recommendation system parsing high-dimensional feature spaces across movie plots, genres, cast, and directorial attributes for over 5,000 films.</p>

        <h4>2. Algorithmic Pipeline</h4>
        <ul>
          <li><strong>Feature Engineering & Text Preprocessing:</strong> Tokenization, stop-word removal, and stemming via PorterStemmer to construct unified metadata tags.</li>
          <li><strong>TF-IDF & Count Vectorization:</strong> Transforms text corpora into sparse numerical vectors in a multi-thousand dimensional metric space.</li>
          <li><strong>Cosine Similarity Matrix:</strong> Computes normalized dot products to yield sub-10ms top-N ranking lookups without brute force recalculation.</li>
        </ul>

        <h4>3. Repository</h4>
        <p><strong>GitHub:</strong> <a href="https://github.com/sanchit037nit/Movie-Recommend" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">github.com/sanchit037nit/Movie-Recommend</a></p>
      `
    }
  };

  // =========================================================================
  // 2. SYNTHESIZED WEB AUDIO (Clean native audio feedback)
  // =========================================================================
  function playBeep(freq = 600, type = 'sine', duration = 0.04) {
    if (!state.soundEnabled) return;
    try {
      if (!state.audioCtx) {
        state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported; fail silently
    }
  }

  // =========================================================================
  // 3. AMBIENT BACKGROUND CANVAS (Geometric particle network)
  // =========================================================================
  function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(width > 768 ? 45 : 22, 50);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 1
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      // Check current theme
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const pColor = isDark ? 'rgba(0, 242, 254, 0.4)' : 'rgba(2, 132, 199, 0.3)';
      const lColor = isDark ? 'rgba(0, 242, 254, ' : 'rgba(2, 132, 199, ';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = pColor;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lColor}${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(renderParticles);
    }
    requestAnimationFrame(renderParticles);
  }

  // =========================================================================
  // 4A. LAB MODE SWITCHER (ML Inference vs High-Throughput Stream)
  // =========================================================================
  function initLabModeSwitcher() {
    const btnMl = document.getElementById('mode-btn-ml');
    const btnStream = document.getElementById('mode-btn-stream');
    const viewMl = document.getElementById('lab-ml-view');
    const viewStream = document.getElementById('lab-stream-view');

    if (!btnMl || !btnStream || !viewMl || !viewStream) return;

    btnMl.addEventListener('click', () => {
      btnMl.classList.add('active');
      btnStream.classList.remove('active');
      viewMl.classList.remove('hidden');
      viewStream.classList.add('hidden');
      playBeep(520, 'sine', 0.03);
    });

    btnStream.addEventListener('click', () => {
      btnStream.classList.add('active');
      btnMl.classList.remove('active');
      viewStream.classList.remove('hidden');
      viewMl.classList.add('hidden');
      playBeep(620, 'sine', 0.03);
    });
  }

  // =========================================================================
  // 4B. LIVE MACHINE LEARNING FRAUD PREDICTOR (Random Forest Simulation)
  // =========================================================================
  function initMLLab() {
    const mlAmount = document.getElementById('ml-amount');
    const mlAmountVal = document.getElementById('ml-amount-val');
    const mlVelocity = document.getElementById('ml-velocity');
    const mlVelocityVal = document.getElementById('ml-velocity-val');
    const mlTrust = document.getElementById('ml-trust');
    const mlTrustVal = document.getElementById('ml-trust-val');
    const mlTime = document.getElementById('ml-time');

    const banner = document.getElementById('ml-decision-banner');
    const icon = document.getElementById('ml-decision-icon');
    const text = document.getElementById('ml-decision-text');
    const sub = document.getElementById('ml-decision-sub');
    const riskScore = document.getElementById('ml-risk-score');

    const fwAmountVal = document.getElementById('fw-amount-val');
    const fwAmountBar = document.getElementById('fw-amount-bar');
    const fwVelocityVal = document.getElementById('fw-velocity-val');
    const fwVelocityBar = document.getElementById('fw-velocity-bar');
    const fwTrustVal = document.getElementById('fw-trust-val');
    const fwTrustBar = document.getElementById('fw-trust-bar');
    const fwTimeVal = document.getElementById('fw-time-val');
    const fwTimeBar = document.getElementById('fw-time-bar');

    const presetBtns = document.querySelectorAll('.preset-btn');

    if (!mlAmount || !banner) return;

    function runInference() {
      const amount = parseFloat(mlAmount.value);
      const velocity = parseInt(mlVelocity.value, 10);
      const trust = parseInt(mlTrust.value, 10);
      const isAnomalousTime = mlTime.value === 'anomalous';

      // Update slider value labels
      mlAmountVal.textContent = `₹ ${amount.toLocaleString('en-IN')}`;
      mlVelocityVal.textContent = `${velocity} txns`;
      mlTrustVal.textContent = `${trust}%`;

      // Random Forest heuristic model emulation
      let amountScore = Math.min(45, (amount / 100000) * 45);
      if (amount > 50000) amountScore += 10;

      let velocityScore = Math.min(35, Math.pow(velocity / 25, 1.35) * 35);
      let untrustScore = ((100 - trust) / 100) * 32;
      let timeScore = isAnomalousTime ? 22 : 0;

      let rawRisk = amountScore * 0.32 + velocityScore * 0.30 + untrustScore * 0.28 + timeScore;
      if (velocity > 12 && trust < 50) rawRisk += 14;
      if (amount > 65000 && isAnomalousTime) rawRisk += 16;

      const prob = Math.min(99.4, Math.max(1.8, rawRisk));
      riskScore.textContent = `${prob.toFixed(1)}%`;

      // Update decision banner state
      banner.classList.remove('flagged', 'warning');
      if (prob >= 60.0) {
        banner.classList.add('flagged');
        icon.textContent = '🚨';
        text.textContent = 'DECLINED • HIGH FRAUD PROBABILITY';
        sub.textContent = 'Velocity surge combined with anomalous device signature exceeds safety cutoff';
      } else if (prob >= 32.0) {
        banner.classList.add('warning');
        icon.textContent = '⚠️';
        text.textContent = 'FLAGGED • STEP-UP MFA REQUIRED';
        sub.textContent = 'Moderate risk indicators detected; prompt secondary authentication';
      } else {
        icon.textContent = '✅';
        text.textContent = 'AUTHORIZED • LOW RISK TRANSACTION';
        sub.textContent = 'Transaction matches expected user baseline and verified device profile';
      }

      // Feature attribution calculation
      const totalSignal = (amountScore * 0.35) + (velocityScore * 0.35) + (untrustScore * 0.3) + (timeScore * 0.5) + 1;
      const attrAmount = Math.max(5, Math.round(((amountScore * 0.35) / totalSignal) * 100));
      const attrVelocity = Math.max(5, Math.round(((velocityScore * 0.35) / totalSignal) * 100));
      const attrTrust = Math.max(5, Math.round(((untrustScore * 0.3) / totalSignal) * 100));
      const attrTime = Math.max(5, 100 - (attrAmount + attrVelocity + attrTrust));

      if (fwAmountVal) {
        fwAmountVal.textContent = `${attrAmount}%`;
        fwAmountBar.style.width = `${attrAmount}%`;
        fwVelocityVal.textContent = `${attrVelocity}%`;
        fwVelocityBar.style.width = `${attrVelocity}%`;
        fwTrustVal.textContent = `${attrTrust}%`;
        fwTrustBar.style.width = `${attrTrust}%`;
        fwTimeVal.textContent = `${attrTime}%`;
        fwTimeBar.style.width = `${attrTime}%`;
      }
    }

    // Attach input listeners
    [mlAmount, mlVelocity, mlTrust].forEach((input) => {
      input.addEventListener('input', () => {
        runInference();
        playBeep(380 + parseInt(input.value, 10) * 0.5, 'sine', 0.015);
      });
    });

    mlTime.addEventListener('change', () => {
      runInference();
      playBeep(520, 'sine', 0.03);
    });

    // Preset Scenarios
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const scenario = btn.dataset.scenario;
        if (scenario === 'normal') {
          mlAmount.value = 1200;
          mlVelocity.value = 2;
          mlTrust.value = 95;
          mlTime.value = 'normal';
        } else if (scenario === 'burst') {
          mlAmount.value = 8500;
          mlVelocity.value = 18;
          mlTrust.value = 85;
          mlTime.value = 'normal';
        } else if (scenario === 'fraud') {
          mlAmount.value = 89000;
          mlVelocity.value = 14;
          mlTrust.value = 15;
          mlTime.value = 'anomalous';
        }
        runInference();
        playBeep(640, 'triangle', 0.04);
      });
    });

    // Initial inference run
    runInference();
  }

  // =========================================================================
  // 4C. REAL-TIME MARKET DATA SIMULATOR & DOUBLE-BUFFERED CANVAS
  // =========================================================================
  function initRealTimeLab() {
    const symbolSelect = document.getElementById('symbol-select');
    const priceDisplay = document.getElementById('live-price-display');
    const changeDisplay = document.getElementById('live-change-display');
    const spreadDisplay = document.getElementById('live-spread');
    const latencyDisplay = document.getElementById('feed-latency');
    const asksContainer = document.getElementById('order-book-asks');
    const bidsContainer = document.getElementById('order-book-bids');
    const pauseBtn = document.getElementById('stream-pause-btn');
    const speedBtns = document.querySelectorAll('.tick-speed-btn:not(.pause-btn)');
    const stressBtn = document.getElementById('stress-test-btn');
    const stressMeta = document.getElementById('stress-meta-text');
    const canvas = document.getElementById('market-canvas');
    const crosshair = document.getElementById('chart-crosshair');
    const crosshairVal = document.getElementById('crosshair-val');
    const hudFps = document.getElementById('hud-fps');
    const hudFrameTime = document.getElementById('hud-frame-time');
    const hudTicksCount = document.getElementById('hud-ticks-count');
    const streamRateCounter = document.getElementById('stream-rate-counter');

    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Setup initial chart dataset
    const meta = symbolsMeta[state.symbol];
    state.currentPrice = meta.current;
    state.basePrice = meta.base;

    state.chartData = [];
    let p = meta.base;
    for (let i = 0; i < state.maxChartPoints; i++) {
      p += (Math.random() - 0.48) * (meta.base * 0.002);
      state.chartData.push(p);
    }
    state.currentPrice = state.chartData[state.chartData.length - 1];

    // Symbol Switcher
    symbolSelect.addEventListener('change', (e) => {
      const chosen = e.target.value;
      if (symbolsMeta[chosen]) {
        state.symbol = chosen;
        const sym = symbolsMeta[chosen];
        state.currentPrice = sym.current;
        state.basePrice = sym.base;

        // Reset chart data for new symbol
        state.chartData = [];
        let cur = sym.base;
        for (let i = 0; i < state.maxChartPoints; i++) {
          cur += (Math.random() - 0.48) * (sym.base * 0.002);
          state.chartData.push(cur);
        }
        state.currentPrice = state.chartData[state.chartData.length - 1];
        renderOrderBook();
        drawCanvasChart();
        playBeep(440, 'triangle', 0.05);
      }
    });

    // Speed Controls
    speedBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        speedBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.tickSpeed = parseInt(btn.dataset.speed, 10);
        restartStreamingTimer();
        if (streamRateCounter) {
          streamRateCounter.textContent = `${Math.round(1000 / state.tickSpeed)} updates/sec`;
        }
        playBeep(520, 'sine', 0.03);
      });
    });

    // Pause / Resume
    pauseBtn.addEventListener('click', () => {
      state.isStreaming = !state.isStreaming;
      pauseBtn.textContent = state.isStreaming ? '⏸' : '▶';
      pauseBtn.classList.toggle('paused', !state.isStreaming);
      if (state.isStreaming) {
        restartStreamingTimer();
      } else {
        clearInterval(state.streamTimer);
      }
      playBeep(330, 'square', 0.04);
    });

    // High Stress Test (Surge)
    stressBtn.addEventListener('click', () => {
      playBeep(880, 'sine', 0.08);
      stressMeta.textContent = '🚀 Ingesting 50 rapid ticks (0ms queue delay)...';
      stressMeta.style.color = 'var(--accent-cyan)';

      let count = 0;
      const surgeInterval = setInterval(() => {
        executeTick(true);
        count++;
        if (count >= 50) {
          clearInterval(surgeInterval);
          stressMeta.textContent = '✅ Handled 50 ticks with 0 dropped frames.';
          stressMeta.style.color = 'var(--accent-emerald)';
          setTimeout(() => {
            stressMeta.textContent = 'Stress test UI frame drop & render stability';
            stressMeta.style.color = 'var(--text-muted)';
          }, 4000);
        }
      }, 15);
    });

    // Core Tick Execution
    function executeTick(isSurge = false) {
      const sym = symbolsMeta[state.symbol];
      const deltaPercent = (Math.random() - 0.495) * 0.003;
      const oldPrice = state.currentPrice;
      const newPrice = Math.max(1, state.currentPrice * (1 + deltaPercent));
      state.currentPrice = newPrice;
      state.totalTicks++;

      state.chartData.push(newPrice);
      if (state.chartData.length > state.maxChartPoints) {
        state.chartData.shift();
      }

      // UI Price Flash
      const isUp = newPrice >= oldPrice;
      const formattedPrice = `${sym.currency}${newPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
      priceDisplay.textContent = formattedPrice;

      priceDisplay.classList.remove('flash-up', 'flash-down');
      void priceDisplay.offsetWidth; // trigger reflow
      priceDisplay.classList.add(isUp ? 'flash-up' : 'flash-down');

      // Price Change calculation
      const netDiff = newPrice - state.basePrice;
      const netPct = (netDiff / state.basePrice) * 100;
      const sign = netDiff >= 0 ? '+' : '';
      changeDisplay.textContent = `${sign}${netPct.toFixed(2)}% (${sign}${netDiff.toFixed(2)})`;
      changeDisplay.className = `price-change-badge ${netDiff >= 0 ? 'positive' : 'negative'}`;

      // Spread update
      const spreadVal = (sym.spread * (1 + (Math.random() - 0.5) * 0.2)).toFixed(2);
      spreadDisplay.textContent = `${spreadVal} (${((spreadVal / newPrice) * 100).toFixed(4)}%)`;

      // Latency simulation (simulated network jitter 2.4ms - 6.2ms)
      const simulatedLatency = (2.4 + Math.random() * 3.5).toFixed(1);
      latencyDisplay.innerHTML = `Latency: <strong>${simulatedLatency}ms</strong>`;

      renderOrderBook();
      drawCanvasChart();

      if (hudTicksCount) {
        hudTicksCount.textContent = state.totalTicks.toLocaleString();
      }
    }

    // Render Order Book Rows
    function renderOrderBook() {
      const sym = symbolsMeta[state.symbol];
      const centerPrice = state.currentPrice;
      const step = sym.step;

      // 5 Asks (prices above current, descending order from top)
      let asksHtml = '';
      let runningAskTotal = 0;
      for (let i = 5; i >= 1; i--) {
        const askPrice = (centerPrice + i * step).toFixed(2);
        const size = (Math.random() * 1.8 + 0.2).toFixed(2);
        runningAskTotal += parseFloat(size);
        const depthWidth = Math.min(100, Math.round((runningAskTotal / 8) * 100));

        asksHtml += `
          <div class="order-row ask-row">
            <span class="ask-price">${askPrice}</span>
            <span>${size}</span>
            <span>${runningAskTotal.toFixed(2)}</span>
            <div class="order-depth-bar" style="width: ${depthWidth}%;"></div>
          </div>
        `;
      }
      asksContainer.innerHTML = asksHtml;

      // 5 Bids (prices below current)
      let bidsHtml = '';
      let runningBidTotal = 0;
      for (let i = 1; i <= 5; i++) {
        const bidPrice = (centerPrice - i * step).toFixed(2);
        const size = (Math.random() * 1.8 + 0.2).toFixed(2);
        runningBidTotal += parseFloat(size);
        const depthWidth = Math.min(100, Math.round((runningBidTotal / 8) * 100));

        bidsHtml += `
          <div class="order-row bid-row">
            <span class="bid-price">${bidPrice}</span>
            <span>${size}</span>
            <span>${runningBidTotal.toFixed(2)}</span>
            <div class="order-depth-bar" style="width: ${depthWidth}%;"></div>
          </div>
        `;
      }
      bidsContainer.innerHTML = bidsHtml;
    }

    // Canvas Chart Rendering (Smooth double-buffered Canvas API)
    function drawCanvasChart() {
      const w = (canvas.width = canvas.parentElement.clientWidth);
      const h = (canvas.height = canvas.parentElement.clientHeight);

      if (!state.chartData.length) return;

      const min = Math.min(...state.chartData) * 0.9995;
      const max = Math.max(...state.chartData) * 1.0005;
      const range = max - min || 1;

      ctx.clearRect(0, 0, w, h);

      // Grid Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      for (let y = 0; y < h; y += h / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Plot Line
      const pts = state.chartData.map((val, idx) => {
        const x = (idx / (state.maxChartPoints - 1)) * w;
        const y = h - ((val - min) / range) * (h - 40) - 20;
        return { x, y };
      });

      // Gradient Fill
      const isUp = state.currentPrice >= state.basePrice;
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      if (isUp) {
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
      } else {
        grad.addColorStop(0, 'rgba(244, 63, 94, 0.28)');
        grad.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const xc = (pts[i].x + pts[i - 1].x) / 2;
        const yc = (pts[i].y + pts[i - 1].y) / 2;
        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, xc, yc);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Stroke Path
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const xc = (pts[i].x + pts[i - 1].x) / 2;
        const yc = (pts[i].y + pts[i - 1].y) / 2;
        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, xc, yc);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.strokeStyle = isUp ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Pulse at head
      const head = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(head.x, head.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)';
      ctx.fill();
    }

    // Chart Crosshair Interaction
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const idx = Math.round((mouseX / canvas.width) * (state.chartData.length - 1));
      if (idx >= 0 && idx < state.chartData.length) {
        crosshair.classList.remove('hidden');
        crosshair.style.left = `${mouseX}px`;
        const sym = symbolsMeta[state.symbol];
        crosshairVal.textContent = `${sym.currency}${state.chartData[idx].toFixed(2)}`;
      }
    });

    canvas.addEventListener('mouseleave', () => {
      crosshair.classList.add('hidden');
    });

    // High-Resolution FPS & Frame-Budget Telemetry
    function measureFramePerformance(time) {
      state.frameCount++;
      const frameDelta = time - state.lastFrameTime;

      if (time - state.lastFrameTime >= 1000) {
        state.fps = Math.round((state.frameCount * 1000) / (time - state.lastFrameTime));
        hudFps.textContent = `${state.fps} FPS`;
        hudFps.className = `hud-value ${state.fps >= 55 ? 'green' : 'amber'}`;

        const avgFrameTime = (1000 / (state.fps || 60)).toFixed(1);
        hudFrameTime.textContent = `${avgFrameTime} ms`;

        state.frameCount = 0;
        state.lastFrameTime = time;
      }
      requestAnimationFrame(measureFramePerformance);
    }
    requestAnimationFrame(measureFramePerformance);

    // Timer Loop
    function restartStreamingTimer() {
      if (state.streamTimer) clearInterval(state.streamTimer);
      state.streamTimer = setInterval(() => {
        if (state.isStreaming) {
          executeTick();
        }
      }, state.tickSpeed);
    }

    // Initial setup
    renderOrderBook();
    drawCanvasChart();
    restartStreamingTimer();

    window.addEventListener('resize', drawCanvasChart);
  }

  // =========================================================================
  // 5. PROJECT CATEGORY FILTERING
  // =========================================================================
  function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        playBeep(480, 'sine', 0.02);

        projectCards.forEach((card) => {
          const categories = card.dataset.category.split(' ');
          if (filter === 'all' || categories.includes(filter)) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // =========================================================================
  // 6. ARCHITECTURE MODAL SYSTEM
  // =========================================================================
  function initArchitectureModals() {
    const modal = document.getElementById('arch-modal');
    const modalClose = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalIcon = document.getElementById('modal-icon');
    const modalContent = document.getElementById('modal-content');
    const triggerBtns = document.querySelectorAll('.open-arch-modal');

    triggerBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.project;
        const data = architectureData[key];
        if (data) {
          modalIcon.textContent = data.icon;
          modalTitle.textContent = data.title;
          modalSubtitle.textContent = data.subtitle;
          modalContent.innerHTML = data.content;
          modal.classList.remove('hidden');
          playBeep(600, 'triangle', 0.04);
        }
      });
    });

    const closeModal = () => {
      modal.classList.add('hidden');
      playBeep(350, 'sine', 0.02);
    };

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // =========================================================================
  // 7. ARCHITECTURE TABS SWITCHER
  // =========================================================================
  function initArchitectureTabs() {
    const tabBtns = document.querySelectorAll('.arch-tab-btn');
    const panes = document.querySelectorAll('.arch-pane');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        panes.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.dataset.tab;
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
        playBeep(520, 'sine', 0.02);
      });
    });
  }

  // =========================================================================
  // 8. INTERACTIVE CLI TERMINAL (Ctrl + K / Cmd + K)
  // =========================================================================
  function initCLITerminal() {
    const cliModal = document.getElementById('cli-modal');
    const cliBtn = document.getElementById('cmd-palette-btn');
    const cliClose = document.getElementById('cli-close-btn');
    const cliCloseDot = document.getElementById('cli-close-dot');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');

    const openTerminal = () => {
      cliModal.classList.remove('hidden');
      cliInput.focus();
      playBeep(640, 'triangle', 0.05);
    };

    const closeTerminal = () => {
      cliModal.classList.add('hidden');
    };

    cliBtn.addEventListener('click', openTerminal);
    cliClose.addEventListener('click', closeTerminal);
    cliCloseDot.addEventListener('click', closeTerminal);
    cliModal.addEventListener('click', (e) => {
      if (e.target === cliModal) closeTerminal();
    });

    // Keyboard shortcut Ctrl+K or Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cliModal.classList.contains('hidden')) {
          openTerminal();
        } else {
          closeTerminal();
        }
      }
      if (e.key === 'Escape' && !cliModal.classList.contains('hidden')) {
        closeTerminal();
      }
    });

    // Terminal Commands Executor
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = cliInput.value.trim().toLowerCase();
        cliInput.value = '';
        if (!cmd) return;

        playBeep(700, 'sine', 0.02);
        appendLine(`<span class="cli-prompt">visitor@sanchit-virdi:~$</span> ${cmd}`);

        handleCommand(cmd);
        cliOutput.scrollTop = cliOutput.scrollHeight;
      }
    });

    function appendLine(html) {
      const line = document.createElement('div');
      line.className = 'cli-line';
      line.innerHTML = html;
      cliOutput.appendChild(line);
    }

    function handleCommand(cmd) {
      switch (cmd) {
        case 'help':
          appendLine(`
            Available commands:<br>
            • <span class="cmd-highlight">bio</span>: Summary & education<br>
            • <span class="cmd-highlight">roles</span>: Target roles (Full-Stack, AI/ML, Systems)<br>
            • <span class="cmd-highlight">experience</span>: Research internship & timeline<br>
            • <span class="cmd-highlight">projects</span>: All 8 production systems<br>
            • <span class="cmd-highlight">skills</span>: Full-Stack, AI/ML & Distributed Systems stack<br>
            • <span class="cmd-highlight">aiml</span>: Machine learning & statistical models overview<br>
            • <span class="cmd-highlight">fullstack</span>: Web platforms & real-time architectures<br>
            • <span class="cmd-highlight">systems</span>: Concurrency, ACID transactions & caching<br>
            • <span class="cmd-highlight">contact</span>: Direct email and GitHub links<br>
            • <span class="cmd-highlight">hire</span>: Why Sanchit is a high-value addition to your team<br>
            • <span class="cmd-highlight">clear</span>: Clear terminal console<br>
            • <span class="cmd-highlight">github</span>: Open GitHub profile
          `);
          break;

        case 'bio':
        case 'about':
          appendLine(`
            <strong>Sanchit Virdi</strong> — Software Engineer across Full-Stack, AI/ML & Distributed Systems.<br>
            <strong>Education:</strong> B.Tech Computer Science & Engineering (Class of 2027), National Institute of Technology (NIT).<br>
            <strong>Research:</strong> Ex-Research Intern at <em>Indian Institute of Technology (IIT) Jammu</em> (Machine Learning & Systems Optimization).<br>
            <strong>Core Focus:</strong> Building production-grade full-stack platforms, low-latency machine learning pipelines, and fault-tolerant concurrent backend architectures.
          `);
          break;

        case 'roles':
          appendLine(`
            🎯 <strong>Engineering Roles & Capabilities:</strong><br>
            • <strong>Full-Stack Engineer:</strong> Modern React 19, Node.js, Express, Socket.io, TypeScript, Zustand, Monaco Editor integration, and end-to-end cloud deployments.<br>
            • <strong>AI / Machine Learning Engineer:</strong> Classical ML (Random Forest 94.9% ROC-AUC), Deep Learning (LSTM spread forecasting), vector similarity (TF-IDF & Cosine distance), and Groq LPU inference.<br>
            • <strong>Backend & Distributed Systems Engineer:</strong> MySQL ACID row-level locking (<code>SELECT ... FOR UPDATE</code>), Redis caching, token-bucket rate limiting, and asynchronous message queues.
          `);
          break;

        case 'aiml':
        case 'ai':
        case 'ml':
          appendLine(`
            🧠 <strong>Machine Learning & Quantitative Modeling:</strong><br>
            • <strong>UPI Fraud Detection:</strong> Scikit-learn Random Forest achieving 94.9% ROC-AUC on imbalanced financial transactions with sub-millisecond inference.<br>
            • <strong>ARO-LSTM Pairs Trading:</strong> Cointegration analysis (Johansen test, ADF stationarity) and LSTM neural networks for mean-reversion trading signals.<br>
            • <strong>ScholarSync AI:</strong> 3-Tier extraction with sub-millisecond SSR deserialization & Groq LPU inference.<br>
            • <strong>Movie Recommender:</strong> High-dimensional TF-IDF vectorization with cosine distance nearest-neighbor lookups.
          `);
          break;

        case 'fullstack':
          appendLine(`
            💻 <strong>Full-Stack Platforms:</strong><br>
            • <strong>Codezy:</strong> Full-stack collaborative code rooms with real-time Socket.io sync, Monaco Editor, and client-to-database AES-256 encryption (Live on Vercel).<br>
            • <strong>GenAI Studio:</strong> React 19 & Vite generative AI interface with token streaming and decoupled Zustand state.<br>
            • <strong>RandomPass:</strong> Pure client-side cryptographic key generator utilizing browser Web Crypto CSPRNG (Live on Vercel).
          `);
          break;

        case 'systems':
        case 'backend':
          appendLine(`
            ⚙️ <strong>Distributed Systems & Backend Concurrency:</strong><br>
            • <strong>High-Concurrency Flight Booking:</strong> Strict MySQL row-level locking (<code>FOR UPDATE</code>) preventing overselling during flash traffic bursts.<br>
            • <strong>Distributed Cache Layer:</strong> Redis sub-5ms lookups with stale-while-revalidate invalidation.<br>
            • <strong>Rate Limiting & Queues:</strong> Distributed token-bucket gateway protection and decoupled async workers.
          `);
          break;

        case 'experience':
          appendLine(`
            <strong>Experience & Academic Milestones:</strong><br>
            • <strong>IIT Jammu:</strong> Research Intern — Machine Learning & Systems Optimization.<br>
            • <strong>Codezy Platform:</strong> Creator & Lead Full-Stack Architect (React 19, Socket.io, MongoDB, Vercel).<br>
            • <strong>National Institute of Technology (NIT):</strong> B.Tech CSE (2023 - 2027).
          `);
          break;

        case 'projects':
          appendLine(`
            1. <strong>Codezy</strong> — Collaborative code rooms (React 19, Socket.io, Monaco, MongoDB) [Live on Vercel]<br>
            2. <strong>ARO-LSTM Pairs Trading</strong> — Cointegration & LSTM quantitative neural engine<br>
            3. <strong>ScholarSync</strong> — Sub-50ms deterministic matcher & Groq LPU AI inference<br>
            4. <strong>Flight Booking System</strong> — High-concurrency ACID transactions & Redis cache<br>
            5. <strong>UPI Fraud Detection</strong> — 94.9% ROC-AUC Random Forest classifier & audit dashboard<br>
            6. <strong>RandomPass</strong> — Web Crypto API client-side entropy generator [Live on Vercel]<br>
            7. <strong>GenAI Studio</strong> — Reactive multi-model LLM workspace (React 19, Zustand)<br>
            8. <strong>Movie Recommender</strong> — Vector space modeling & cosine similarity engine
          `);
          break;

        case 'skills':
          appendLine(`
            • <strong>Full-Stack Web:</strong> React 19, TypeScript, JavaScript ES6+, HTML5 Canvas, Zustand, Monaco Editor, Tailwind, REST APIs<br>
            • <strong>Real-Time & Sockets:</strong> WebSockets, Socket.io, requestAnimationFrame batching, Virtualized lists<br>
            • <strong>Backend & Systems:</strong> Node.js, Express, MySQL (ACID Row-Locks), Redis, Kafka/Queues, MongoDB, Docker<br>
            • <strong>AI & Machine Learning:</strong> Python, TensorFlow/Keras (LSTM), Scikit-learn, Random Forest, NumPy, Pandas, Groq LPU
          `);
          break;

        case 'fintech':
          appendLine(`
            <em>Fintech & Trading Philosophy:</em><br>
            "In high-frequency and financial systems, zero-lag execution and data integrity are non-negotiable. Every millisecond of latency, dropped socket frame, or desynchronized quote damages trust. Systems must be deterministic, fault-tolerant, and mathematically sound."
          `);
          break;

        case 'hire':
          appendLine(`
            ⚡ <strong>Why Sanchit Virdi:</strong><br>
            - B.Tech CSE graduating in 2027 (NIT) & <strong>Research Intern at IIT Jammu</strong><br>
            - Proven full-stack production delivery across live deployed apps (Codezy, RandomPass)<br>
            - Rigorous machine learning foundation (94.9% ROC-AUC UPI Fraud, LSTM Pairs Trading)<br>
            - Strong systems intuitions: concurrency locks, sub-50ms algorithms, and 60-120 FPS UI performance.
          `);
          break;

        case 'contact':
          appendLine(`
            Email: <a href="mailto:10dsanchitbis.virdi@gmail.com" style="color:var(--accent-cyan);">10dsanchitbis.virdi@gmail.com</a><br>
            GitHub: <a href="https://github.com/sanchit037nit" target="_blank" style="color:var(--accent-cyan);">github.com/sanchit037nit</a><br>
            Location: Open to Any Location (Onsite, Hybrid & Remote)
          `);
          break;

        case 'github':
          window.open('https://github.com/sanchit037nit', '_blank');
          appendLine('Opening github.com/sanchit037nit in a new tab...');
          break;

        case 'clear':
          cliOutput.innerHTML = '';
          break;

        default:
          appendLine(`Command not found: '<span style="color:#f43f5e">${cmd}</span>'. Type '<span class="cmd-highlight">help</span>' for a list of available commands.`);
      }
    }
  }

  // =========================================================================
  // 9. RESUME MODAL & PRINT CONTROLS
  // =========================================================================
  function initResumeModal() {
    const resumeModal = document.getElementById('resume-modal');
    const openBtn = document.getElementById('quick-resume-btn');
    const closeBtn = document.getElementById('resume-close-btn');
    const printBtn = document.getElementById('print-resume-btn');

    openBtn.addEventListener('click', () => {
      resumeModal.classList.remove('hidden');
      playBeep(580, 'sine', 0.03);
    });

    closeBtn.addEventListener('click', () => {
      resumeModal.classList.add('hidden');
    });

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) resumeModal.classList.add('hidden');
    });

    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // =========================================================================
  // 10. CONTACT FORM & EMAIL COPYING
  // =========================================================================
  function initContactSection() {
    const copyBtn = document.getElementById('copy-email-btn');
    const copyStatus = document.getElementById('copy-status');
    const emailToCopy = '10dsanchitbis.virdi@gmail.com';

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        copyStatus.textContent = 'Copied!';
        copyBtn.style.background = 'rgba(16, 185, 129, 0.2)';
        copyBtn.style.borderColor = 'var(--accent-emerald)';
        playBeep(800, 'sine', 0.05);

        setTimeout(() => {
          copyStatus.textContent = 'Copy';
          copyBtn.style.background = '';
          copyBtn.style.borderColor = '';
        }, 2500);
      });
    });

    const contactForm = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      playBeep(600, 'sine', 0.06);

      // Trigger user's default email client with pre-filled content
      const mailtoUri = `mailto:${emailToCopy}?subject=${encodeURIComponent(
        `[Portfolio] ${subject} - ${name}`
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      window.location.href = mailtoUri;

      feedback.className = 'form-feedback success';
      feedback.textContent = 'Opening your mail client... Thank you for reaching out!';
      feedback.classList.remove('hidden');

      setTimeout(() => {
        contactForm.reset();
        feedback.classList.add('hidden');
      }, 5000);
    });
  }

  // =========================================================================
  // 11. THEME & SOUND CONTROLS & MOBILE DRAWER
  // =========================================================================
  function initHeaderControls() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    const soundBtn = document.getElementById('sound-toggle-btn');
    const soundOnIcon = document.getElementById('sound-icon-on');
    const soundOffIcon = document.getElementById('sound-icon-off');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    // Set initial theme
    if (state.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    }

    themeBtn.addEventListener('click', () => {
      const isCurrentlyDark = document.documentElement.getAttribute('data-theme') !== 'light';
      if (isCurrentlyDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('sv_theme', 'light');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('sv_theme', 'dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
      playBeep(500, 'sine', 0.03);
    });

    // Sound Toggle
    soundBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('sv_sound', state.soundEnabled ? 'true' : 'false');
      soundOnIcon.classList.toggle('hidden', !state.soundEnabled);
      soundOffIcon.classList.toggle('hidden', state.soundEnabled);
      if (state.soundEnabled) playBeep(750, 'sine', 0.05);
    });

    // Mobile Drawer
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      playBeep(450, 'sine', 0.02);
    });

    document.querySelectorAll('.mobile-item').forEach((item) => {
      item.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // =========================================================================
  // 12. INITIALIZATION ORCHESTRATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    initLabModeSwitcher();
    initMLLab();
    initRealTimeLab();
    initProjectFilters();
    initArchitectureModals();
    initArchitectureTabs();
    initCLITerminal();
    initResumeModal();
    initContactSection();
    initHeaderControls();

    console.log('%c[Sanchit Virdi Portfolio]%c Initialized with Systems, AI & Real-Time Engine.', 'color: #00f2fe; font-weight: bold;', 'color: #10b981;');
  });
})();
