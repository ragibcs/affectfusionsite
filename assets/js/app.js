(() => {
  const DATA = window.AFFECTFUSION_DATA || {};
  const EMOTIONS = ["Joy", "Neutral", "Anger", "Sadness", "Surprise", "Sarcasm", "Fear", "Disgust", "Anticipation"];

  // ---------- Toast ----------
  const toastEl = document.getElementById("toast");
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  // ---------- Reading Progress & Back-to-Top ----------
  const progressEl = document.getElementById("readProgress");
  const backTopBtn = document.getElementById("backTop");
  function onScrollUI() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progressEl) {
      const pct = h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0;
      progressEl.style.width = `${pct.toFixed(2)}%`;
    }
    if (backTopBtn) {
      backTopBtn.classList.toggle("show", window.scrollY > 520);
    }
  }
  window.addEventListener("scroll", onScrollUI, { passive: true });
  onScrollUI();
  backTopBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ---------- Subtle Editorial Reveal ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // ---------- Mobile Drawer ----------
  const menuBtn = document.getElementById("menuToggle");
  const drawer = document.getElementById("mobileDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  const drawerClose = document.getElementById("drawerClose");
  function openDrawer() {
    drawer?.classList.add("open");
    backdrop?.classList.add("open");
    menuBtn?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawer?.classList.remove("open");
    backdrop?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  menuBtn?.addEventListener("click", openDrawer);
  drawerClose?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  document.querySelectorAll(".drawer-links a").forEach((a) => a.addEventListener("click", closeDrawer));

  // ---------- 3-Theme Switcher (Ivory · Blueprint · Sage) ----------
  const VALID_THEMES = ["ivory", "blueprint", "sage"];
  const themeButtons = document.querySelectorAll("[data-theme-pick]");
  function applyTheme(name, announce = false) {
    const theme = VALID_THEMES.includes(name) ? name : "ivory";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("af_palette", theme);
    themeButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-theme-pick") === theme;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
    if (announce) {
      const labels = { ivory: "Ivory Theme", blueprint: "Blueprint Theme", sage: "Sage Theme" };
      showToast(labels[theme]);
    }
  }
  applyTheme(localStorage.getItem("af_palette") || "ivory", false);
  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyTheme(btn.getAttribute("data-theme-pick"), true));
  });

  // ---------- Scrollspy (Desktop + Mobile Drawer) ----------
  const navLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#'], .drawer-links a[href^='#']"));
  const sectionIds = [...new Set(navLinks.map((a) => a.getAttribute("href")))];
  const sections = sectionIds.map((id) => document.querySelector(id)).filter(Boolean);
  function updateSpy() {
    const pos = window.scrollY + 135;
    let current = sections[0];
    for (const sec of sections) {
      if (sec.offsetTop <= pos) current = sec;
    }
    navLinks.forEach((a) => {
      a.classList.toggle("active", current && a.getAttribute("href") === `#${current.id}`);
    });
  }
  window.addEventListener("scroll", updateSpy, { passive: true });
  updateSpy();

  // ---------- Copy Buttons ----------
  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const target = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!target) return;
      const text = target.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard");
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        showToast("Copied to clipboard");
      }
    });
  });

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---------- Hero Live Specimen Switcher ----------
  const HERO_SPECIMENS = {
    eng: {
      quote: "<USER>-q7w and they were great special effects 🙄",
      wrong: "Text-Only Model: Joy (fooled by literal praise)",
      right: "Consensus Gold & Fusion: Sarcasm (unanimous · rolling eyes)"
    },
    bn: {
      quote: "জনগণকে ২৪ ঘন্টা বিদ্যুৎ দিতে পারে না, আবার আসছে বৈদ্যুতিক রেল 😂",
      wrong: "Text-Only Model: Anger (literal complaint)",
      right: "Consensus Gold & Fusion: Sarcasm (unanimous · mocking laugh)"
    },
    bng: {
      quote: "Apnake keo jigges Kore nai 🙄",
      wrong: "Text-Only Model: Sadness (missed Romanized irony)",
      right: "Consensus Gold & Fusion: Sarcasm (adjudicated · eye-roll)"
    }
  };
  const heroSpecQuote = document.getElementById("heroSpecQuote");
  const heroSpecWrong = document.getElementById("heroSpecWrong");
  const heroSpecRight = document.getElementById("heroSpecRight");
  document.querySelectorAll("[data-hero-spec]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-hero-spec]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const s = HERO_SPECIMENS[btn.getAttribute("data-hero-spec")];
      if (!s) return;
      heroSpecQuote.textContent = s.quote;
      heroSpecWrong.textContent = s.wrong;
      heroSpecRight.textContent = s.right;
    });
  });

  // ---------- Interactive Dissection Lab ----------
  const DISSECT_CASES = [
    {
      lang: "ENG · Sarcasm (AFG_038543)",
      raw: "<USER>-q7w and they were great special effects 🙄",
      textOnly: "<USER>-q7w and they were great special effects",
      demoji: "face with rolling eyes",
      blindPred: "Predicted: Joy (fooled by 'great')",
      blindNote: "Without the eye-roll glyph, XLM-R Text-Only reads literal praise (Sarcasm F1 collapses to 0.3153).",
      fusionPred: "Predicted: Sarcasm ✓ (+14.73 F1 lift)",
      fusionNote: "CLDR 'face with rolling eyes' inverts positive wording to recover unanimous Consensus Gold Sarcasm."
    },
    {
      lang: "BN · Sarcasm (AFG_016172)",
      raw: "জনগণকে ২৪ ঘন্টা বিদ্যুৎ দিতে পারে না, আবার আসছে বৈদ্যুতিক রেল 😂",
      textOnly: "জনগণকে ২৪ ঘন্টা বিদ্যুৎ দিতে পারে না, আবার আসছে বৈদ্যুতিক রেল",
      demoji: "face with tears of joy",
      blindPred: "Predicted: Anger (literal grievance)",
      blindNote: "Stripping the mocking laugh glyph causes Text-Only to misread ironic civic satire as raw Anger.",
      fusionPred: "Predicted: Sarcasm ✓ (Unanimous Gold)",
      fusionNote: "Pairing the grievance with 😂 ('face with tears of joy') signals sarcastic mockery across Bangla script."
    },
    {
      lang: "BNG · Sarcasm (AFG_047815)",
      raw: "1 year hoye gelo akhono full record ta fash krte parlo na 🤡",
      textOnly: "1 year hoye gelo akhono full record ta fash krte parlo na",
      demoji: "clown face",
      blindPred: "Predicted: Sadness (missed mockery)",
      blindNote: "Romanized Banglish without emoji cues loses its derisive signal (BNG Text-Only F1 drops to 0.4379).",
      fusionPred: "Predicted: Sarcasm ✓ (+11.31 BNG F1 lift)",
      fusionNote: "The clown face glyph anchors sarcastic mockery and lifts Banglish Macro-F1 from 0.4379 to 0.5510."
    }
  ];
  const dissectGrid = document.getElementById("dissectGrid");
  let dissectMode = "fusion";
  function renderDissect() {
    if (!dissectGrid) return;
    const isFusion = dissectMode === "fusion";
    dissectGrid.innerHTML = DISSECT_CASES.map((c) => `
      <div class="dissect-card ${isFusion ? "fusion-on" : "blind-on"}">
        <div>
          <div class="dissect-lang"><span>${esc(c.lang)}</span><span>${isFusion ? "DUAL-STREAM" : "EMOJIS STRIPPED"}</span></div>
          <div class="dissect-text">${esc(isFusion ? c.raw : c.textOnly)}</div>
          ${isFusion ? `<div class="mono" style="font-size:0.7rem;color:var(--ink-muted);margin-top:6px">CLDR: ${esc(c.demoji)}</div>` : `<div class="mono" style="font-size:0.7rem;color:var(--vermilion);margin-top:6px">[emoji_stream removed]</div>`}
        </div>
        <div class="dissect-outcome">
          <div class="${isFusion ? "pred-good" : "pred-bad"}">${esc(isFusion ? c.fusionPred : c.blindPred)}</div>
          <div class="dissect-explain">${esc(isFusion ? c.fusionNote : c.blindNote)}</div>
        </div>
      </div>`).join("");
  }
  document.querySelectorAll("[data-dissect-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-dissect-mode]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      dissectMode = btn.getAttribute("data-dissect-mode");
      renderDissect();
    });
  });
  renderDissect();

  // ---------- 1. Split Provenance & Augmentation Inspector ----------
  const splitPanel = document.getElementById("splitPanel");
  const splitBtns = document.querySelectorAll("[data-split-tab]");
  function renderSplitTab(tab) {
    if (!splitPanel || !DATA.splits) return;
    const sp = DATA.splits.splits;
    if (tab === "augmentation") {
      const aug = DATA.augmentation;
      const rowsHtml = EMOTIONS.map((emo) => {
        const c = aug.classes[emo];
        const methods = c.methods ? Object.entries(c.methods).map(([k, v]) => `${k}: ${v}`).join(", ") : "Balanced natively";
        const langs = c.lang_added ? Object.entries(c.lang_added).map(([k, v]) => `${k} +${v}`).join(" · ") : "—";
        return `<tr>
          <td><strong>${emo}</strong></td>
          <td class="num">${c.real_train.toLocaleString()}</td>
          <td class="num">${c.augmented_added > 0 ? `+${c.augmented_added.toLocaleString()}` : "0"}</td>
          <td class="num"><strong>${c.final_train.toLocaleString()}</strong></td>
          <td>${esc(langs)}</td>
          <td class="mono" style="font-size:0.75rem">${esc(methods)}</td>
        </tr>`;
      }).join("");
      splitPanel.innerHTML = `
        <p style="margin:0 0 12px;color:var(--ink-2)">Executed <strong>strictly inside <code>train_24k</code> after locking <code>val_3k</code> and <code>test_3k</code></strong> across ${aug.total_gemini_calls} Gemini Flash batches (${aug.total_augmented.toLocaleString()} emoji-preserving paraphrases, including 1,116 cross-lingual ENG→BN/BNG Fear transfers). Zero augmented rows appear in Validation or Test.</p>
        <p class="swipe-hint">← Swipe table horizontally →</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Emotion</th><th class="num">Real Train</th><th class="num">Aug. Added</th><th class="num">Final Train</th><th>Language Boost</th><th>Method Breakdown</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>`;
      return;
    }

    let info;
    if (tab === "total") {
      const totals = {};
      EMOTIONS.forEach((e) => { totals[e] = sp.train.class_counts[e] + sp.val.class_counts[e] + sp.test.class_counts[e]; });
      const eng = sp.train.language_counts.ENG + sp.val.language_counts.ENG + sp.test.language_counts.ENG;
      const bn = sp.train.language_counts.BN + sp.val.language_counts.BN + sp.test.language_counts.BN;
      const bng = sp.train.language_counts.BNG + sp.val.language_counts.BNG + sp.test.language_counts.BNG;
      const emoRows = sp.train.emoji_rows + sp.val.emoji_rows + sp.test.emoji_rows;
      info = {
        title: "Full Consensus Corpus Ledger (N = 30,000 · 80 / 10 / 10)",
        rows: 30000, real: 24872, aug: 3528, ext: 2747,
        gold: "5,000 Double-Verified (κ = 0.7717, α = 0.7717)",
        emoji_pct: ((emoRows / 30000) * 100).toFixed(2),
        lang: { ENG: [eng, (eng / 300).toFixed(1)], BN: [bn, (bn / 300).toFixed(1)], BNG: [bng, (bng / 300).toFixed(1)] },
        counts: totals,
        note: "24,872 freshly scraped real rows + 1,600 train-only DAIR-AI rows (Fear 1,100 + Surprise 500) + 3,528 train-only Gemini Flash paraphrases."
      };
    } else {
      const s = sp[tab];
      const goldMap = { train: "0 (AI conf ≥ 3)", val: "2,000 (66.7% Consensus Gold)", test: "3,000 (100% Consensus Gold)" };
      const titleMap = {
        train: "Train Split (24,000 Rows · 80%)",
        val: "Validation Split (3,000 Rows · 10% · Consensus Gold)",
        test: "Test Benchmark (3,000 Rows · 10% · 100% Consensus Gold)"
      };
      info = {
        title: titleMap[tab],
        rows: s.rows, real: tab === "train" ? 18872 : 3000, aug: s.augmented_rows, ext: s.external_train_only_rows,
        gold: goldMap[tab], emoji_pct: s.emoji_pct.toFixed(2),
        lang: {
          ENG: [s.language_counts.ENG, s.language_pct.ENG.toFixed(1)],
          BN: [s.language_counts.BN, s.language_pct.BN.toFixed(1)],
          BNG: [s.language_counts.BNG, s.language_pct.BNG.toFixed(1)]
        },
        counts: s.class_counts,
        note: tab === "train"
          ? "Balanced 2,666–2,667 rows/class. Filter (is_augmented==0 & is_external_train_only==0) for strictly 18,872 native freshly scraped rows."
          : "100% freshly scraped real comments · 0 augmented · 0 external · 0 text-hash overlap · verified via blind dual-annotator consensus."
      };
    }

    const maxCnt = Math.max(...Object.values(info.counts));
    const classBars = EMOTIONS.map((e) => {
      const val = info.counts[e];
      const pct = ((val / maxCnt) * 100).toFixed(1);
      return `<div class="bar-row">
        <div class="bar-head"><span>${e}</span><span class="mono">${val.toLocaleString()} <span class="sub">(${((val / info.rows) * 100).toFixed(1)}%)</span></span></div>
        <div class="bar-track"><div class="bar-fill ${tab === "test" ? "forest" : ""}" style="width:${pct}%"></div></div>
      </div>`;
    }).join("");

    splitPanel.innerHTML = `
      <div class="grid-2">
        <div class="folio-box">
          <h3>${info.title}</h3>
          <p>${info.note}</p>
          <div style="border-top:1px solid var(--rule);margin:14px 0;padding-top:10px">
            <div class="colophon-row"><span class="k">Real Scraped</span><span class="v mono">${info.real.toLocaleString()} rows</span></div>
            <div class="colophon-row"><span class="k">Human Gold</span><span class="v mono" style="color:var(--forest)">${info.gold}</span></div>
            <div class="colophon-row"><span class="k">Provenance</span><span class="v mono">${info.aug.toLocaleString()} aug · ${info.ext.toLocaleString()} external</span></div>
            <div class="colophon-row"><span class="k">Emoji Share</span><span class="v mono" style="color:var(--vermilion)">${info.emoji_pct}%</span></div>
          </div>
          <div class="bar-list" style="margin-top:14px">
            <div class="bar-row"><div class="bar-head"><span>English (ENG)</span><span class="mono">${info.lang.ENG[0].toLocaleString()} (${info.lang.ENG[1]}%)</span></div><div class="bar-track"><div class="bar-fill" style="width:${info.lang.ENG[1]}%"></div></div></div>
            <div class="bar-row"><div class="bar-head"><span>Native Bangla (BN)</span><span class="mono">${info.lang.BN[0].toLocaleString()} (${info.lang.BN[1]}%)</span></div><div class="bar-track"><div class="bar-fill forest" style="width:${info.lang.BN[1]}%"></div></div></div>
            <div class="bar-row"><div class="bar-head"><span>Romanized Banglish (BNG)</span><span class="mono">${info.lang.BNG[0].toLocaleString()} (${info.lang.BNG[1]}%)</span></div><div class="bar-track"><div class="bar-fill vermilion" style="width:${info.lang.BNG[1]}%"></div></div></div>
          </div>
        </div>
        <div class="folio-box">
          <h3>9-Class Balance Profile</h3>
          <div class="bar-list">${classBars}</div>
        </div>
      </div>`;
  }
  splitBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      splitBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderSplitTab(btn.getAttribute("data-split-tab"));
    });
  });
  renderSplitTab("test");

  // ---------- 2. Interactive Specimen Explorer ----------
  const sampleGrid = document.getElementById("sampleGrid");
  const sampleCountEl = document.getElementById("sampleCount");
  const fLang = document.getElementById("filterLang");
  const fEmo = document.getElementById("filterEmotion");
  const fMod = document.getElementById("filterModality");
  const fGold = document.getElementById("filterGold");
  const fSearch = document.getElementById("filterSearch");

  function renderSamples() {
    if (!sampleGrid || !Array.isArray(DATA.samples)) return;
    const lang = fLang.value, emo = fEmo.value, mod = fMod.value, gold = fGold.value;
    const q = fSearch.value.trim().toLowerCase();

    const filtered = DATA.samples.filter((s) => {
      if (lang !== "ALL" && s.language_tag !== lang) return false;
      if (emo !== "ALL" && s.label !== emo) return false;
      if (mod === "EMOJI" && !s.has_emoji) return false;
      if (mod === "TEXT" && s.has_emoji) return false;
      if (gold === "ADJUDICATED" && s.agreed) return false;
      if (gold === "UNANIMOUS" && !s.agreed) return false;
      if (q && !(s.raw_text + " " + s.demoji_text + " " + s.platform + " " + s.row_id).toLowerCase().includes(q)) return false;
      return true;
    });

    if (sampleCountEl) {
      sampleCountEl.textContent = `INDEXING ${filtered.length} OF ${DATA.samples.length} CURATED 100% CONSENSUS GOLD SPECIMENS`;
    }

    if (!filtered.length) {
      sampleGrid.innerHTML = `<div class="folio-box" style="grid-column:1/-1;text-align:center"><p>No specimens match the selected filters.</p></div>`;
      return;
    }

    sampleGrid.innerHTML = filtered.map((s) => {
      const consensusStamp = s.agreed
        ? `<span class="stamp gold">Unanimous (A1 &amp; A2): ${esc(s.label)}</span>`
        : `<span class="stamp flip">Adjudicated (${esc(s.ragib_label)} vs ${esc(s.galib_label)} → ${esc(s.label)})</span>`;
      return `<article class="specimen-card">
        <div class="specimen-meta">
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            <span class="stamp lang">${esc(s.language_tag)}</span>
            <span class="stamp gold">${esc(s.label)} #${s.label_id}</span>
            ${consensusStamp}
          </div>
          <span style="color:var(--ink-muted)">${esc(s.row_id)} · ${esc(s.platform)}</span>
        </div>
        <div class="specimen-raw">${esc(s.raw_text)}</div>
        <div class="stream-pair">
          <div class="stream-cell">
            <div class="sl">text_stream</div>
            <div class="sv">${esc(s.text_stream || "—")}</div>
          </div>
          <div class="stream-cell">
            <div class="sl">emoji_stream (${s.emoji_count}) &amp; CLDR demoji</div>
            <div class="sv">${s.has_emoji ? `${esc(s.emoji_stream)} · <span style="color:var(--ink-muted)">${esc(s.demoji_text)}</span>` : "<em>Text-only specimen</em>"}</div>
          </div>
        </div>
      </article>`;
    }).join("");
  }
  [fLang, fEmo, fMod, fGold].forEach((el) => el && el.addEventListener("change", renderSamples));
  fSearch?.addEventListener("input", renderSamples);
  renderSamples();

  // ---------- 3. Tufte Benchmark Chart Explorer ----------
  const benchChart = document.getElementById("benchChart");
  let activeBenchSplit = "test_3k_gold";
  let activeBenchView = "overall";

  function renderBenchmarks() {
    if (!benchChart || !DATA.eval) return;
    const m = DATA.eval.metrics[activeBenchSplit];
    const m1 = m["CNN-BiLSTM (Kusal et al.)"];
    const m2 = m["XLM-R Text-Only"];
    const m3 = m["XLM-R Early Fusion"];

    let items = [];
    if (activeBenchView === "overall") {
      items = [
        { label: "Overall Accuracy", v1: m1.accuracy * 100, v2: m2.accuracy * 100, v3: m3.accuracy * 100 },
        { label: "Overall Macro-F1", v1: m1.macro_f1 * 100, v2: m2.macro_f1 * 100, v3: m3.macro_f1 * 100 },
        { label: `Emoji-Bearing Macro-F1 (n=${m3.by_modality.Emoji.support.toLocaleString()})`, v1: m1.by_modality.Emoji.macro_f1 * 100, v2: m2.by_modality.Emoji.macro_f1 * 100, v3: m3.by_modality.Emoji.macro_f1 * 100 },
        { label: `Emoji-Bearing Accuracy (n=${m3.by_modality.Emoji.support.toLocaleString()})`, v1: m1.by_modality.Emoji.accuracy * 100, v2: m2.by_modality.Emoji.accuracy * 100, v3: m3.by_modality.Emoji.accuracy * 100 },
        { label: `Non-Emoji Macro-F1 (n=${m3.by_modality["Non-Emoji"].support.toLocaleString()})`, v1: m1.by_modality["Non-Emoji"].macro_f1 * 100, v2: m2.by_modality["Non-Emoji"].macro_f1 * 100, v3: m3.by_modality["Non-Emoji"].macro_f1 * 100 },
      ];
    } else if (activeBenchView === "language") {
      items = [
        { label: `English (ENG · n=${m3.by_language.ENG.support}) — Macro-F1`, v1: m1.by_language.ENG.macro_f1 * 100, v2: m2.by_language.ENG.macro_f1 * 100, v3: m3.by_language.ENG.macro_f1 * 100 },
        { label: `Native Bangla (BN · n=${m3.by_language.BN.support}) — Macro-F1`, v1: m1.by_language.BN.macro_f1 * 100, v2: m2.by_language.BN.macro_f1 * 100, v3: m3.by_language.BN.macro_f1 * 100 },
        { label: `Romanized Banglish (BNG · n=${m3.by_language.BNG.support}) — Macro-F1`, v1: m1.by_language.BNG.macro_f1 * 100, v2: m2.by_language.BNG.macro_f1 * 100, v3: m3.by_language.BNG.macro_f1 * 100 },
      ];
    } else {
      items = EMOTIONS.map((e) => ({
        label: `${e} F1 (n=${m3.per_class[e].support})`,
        v1: m1.per_class[e].f1 * 100, v2: m2.per_class[e].f1 * 100, v3: m3.per_class[e].f1 * 100
      }));
    }

    benchChart.innerHTML = items.map((it) => {
      const diff = (it.v3 - it.v2).toFixed(2);
      const sign = Number(diff) >= 0 ? `+${diff}` : diff;
      return `<div class="tufte-group">
        <div class="tufte-head">
          <span class="t-title">${esc(it.label)}</span>
          <span class="t-delta">Δ Fusion vs. Text-Only: ${sign} pts</span>
        </div>
        <div class="tufte-bars">
          <div class="tufte-bar-row"><span class="m-lbl">CNN-BiLSTM (Kusal)</span><div class="bar-track"><div class="bar-fill slate" style="width:${it.v1.toFixed(1)}%"></div></div><span class="m-val">${it.v1.toFixed(2)}%</span></div>
          <div class="tufte-bar-row"><span class="m-lbl">XLM-R Text-Only</span><div class="bar-track"><div class="bar-fill vermilion" style="width:${it.v2.toFixed(1)}%"></div></div><span class="m-val">${it.v2.toFixed(2)}%</span></div>
          <div class="tufte-bar-row best"><span class="m-lbl">XLM-R Early Fusion</span><div class="bar-track"><div class="bar-fill forest" style="width:${it.v3.toFixed(1)}%"></div></div><span class="m-val">${it.v3.toFixed(2)}%</span></div>
        </div>
      </div>`;
    }).join("");
  }

  document.querySelectorAll("[data-bench-split]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-bench-split]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeBenchSplit = btn.getAttribute("data-bench-split");
      renderBenchmarks();
    });
  });
  document.querySelectorAll("[data-bench-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-bench-view]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeBenchView = btn.getAttribute("data-bench-view");
      renderBenchmarks();
    });
  });
  renderBenchmarks();

  // ---------- 4. Plate Gallery Filter ----------
  const galBtns = document.querySelectorAll("[data-gallery-tab]");
  const galCards = document.querySelectorAll("[data-gallery-cat]");
  galBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      galBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-gallery-tab");
      galCards.forEach((card) => {
        card.style.display = (cat === "all" || card.getAttribute("data-gallery-cat") === cat) ? "" : "none";
      });
    });
  });

  // ---------- 5. Lightbox ----------
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbDesc = document.getElementById("lbDesc");
  const zoomables = Array.from(document.querySelectorAll(".figure-thumb[data-src]"));
  let lbIndex = 0;

  function openLightbox(idx) {
    if (!lightbox || !zoomables.length) return;
    lbIndex = (idx + zoomables.length) % zoomables.length;
    const el = zoomables[lbIndex];
    lbImg.src = el.getAttribute("data-src");
    lbImg.alt = el.getAttribute("data-title") || "";
    lbTitle.textContent = el.getAttribute("data-title") || "Plate Preview";
    lbDesc.textContent = el.getAttribute("data-desc") || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  zoomables.forEach((el, idx) => el.addEventListener("click", () => openLightbox(idx)));
  document.getElementById("lbClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lbPrev")?.addEventListener("click", () => openLightbox(lbIndex - 1));
  document.getElementById("lbNext")?.addEventListener("click", () => openLightbox(lbIndex + 1));
  lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeDrawer();
    }
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
    if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
  });

  // ---------- 6. BibTeX Switcher ----------
  const BIBTEX = {
    hf: `@dataset{hasan2026affectfusion_hf,
  author       = {Hasan, MD. Ragib and Galib, MD. Asadulla Hel and Akter, Sharmin and Raza, Dewan Mamun},
  title        = {{AffectFusion: A Multilingual Multimodal Text-and-Emoji Emotion Recognition Dataset (English, Bangla, and Banglish)}},
  year         = {2026},
  month        = nov,
  publisher    = {Hugging Face},
  doi          = {10.57967/hf/11874},
  url          = {https://huggingface.co/datasets/ragibhasan/AffectFusion}
}`,
    zenodo: `@dataset{hasan2026affectfusion_zenodo,
  author       = {Hasan, MD. Ragib and Galib, MD. Asadulla Hel and Akter, Sharmin and Raza, Dewan Mamun},
  title        = {{AffectFusion: A Multilingual Multimodal Text-and-Emoji Emotion Recognition Dataset (English, Bangla, and Banglish)}},
  year         = {2026},
  month        = nov,
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.24543680},
  url          = {https://zenodo.org/records/24543680}
}`,
    github: `@misc{hasan2026affectfusion_code,
  author       = {Hasan, MD. Ragib and Galib, MD. Asadulla Hel and Akter, Sharmin and Raza, Dewan Mamun},
  title        = {{AffectFusion: Cross-Attention Transformer Framework and Phase-I Multimodal Emotion Benchmark}},
  year         = {2026},
  howpublished = {\\url{https://github.com/ragibcs/AffectFusion}},
  note         = {Phase-I Thesis Codebase (Manuscript Target: Feb 2027)},
  institution  = {Department of Computer Science and Engineering, Daffodil International University}
}`
  };
  const bibOut = document.getElementById("bibtexCode");
  document.querySelectorAll("[data-bib-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-bib-tab]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.getAttribute("data-bib-tab");
      if (bibOut && BIBTEX[key]) bibOut.textContent = BIBTEX[key];
    });
  });
})();
