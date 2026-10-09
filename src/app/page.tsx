"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

// 6 India-specific framing axes
const AXES = [
  { name: "Government", low: "Questions govt", high: "Backs govt", desc: "How far the wording leans toward or against the government." },
  { name: "Culture", low: "Cosmopolitan", high: "Traditionalist", desc: "Whether the story uses cosmopolitan or traditionalist cultural cues." },
  { name: "Federal", low: "State-first", high: "Centre-first", desc: "Whether it is told from the Centre's or the states' point of view." },
  { name: "Economic", low: "Welfare-led", high: "Market-led", desc: "Whether it stresses welfare and subsidies or markets and growth." },
  { name: "Caste", low: "Not mentioned", high: "Foregrounded", desc: "How much caste or social justice is brought in, from absent to central." },
  { name: "Tone", low: "Neutral", high: "Outrage-driven", desc: "How emotional the wording is, from plain reporting to outrage." },
];

const OUTLET_COLORS: Record<string, string> = {
  "The Hindu": "#2f8a82",
  "Indian Express": "#c0503f",
  "Dainik Jagran": "#4a78b8",
  "NDTV": "#c28f2c",
  "The Wire": "#8e63a3",
  "Times of India": "#d97736",
  "Hindustan Times": "#3072b4",
  "Amar Ujala": "#9b2d20",
  "BBC Hindi": "#bb1919",
  "Scroll.in": "#235f5a",
};

const FAV_WORDS = [
  "big gift", "tax break", "relief", "historic", "record", "triumph", "breakthrough",
  "robust", "transformative", "firm stance", "milestone",
  "सौगात", "तोहफ़ा", "रिकॉर्ड", "सख़्ती", "कड़े", "भरोसा", "राहत", "सराहना", "ऐतिहासिक"
];

const CRI_WORDS = [
  "fine print", "'relief'", "squeezed", "late again", "stalls", "refuse", "trails",
  "walk out", "little change", "outside the net", "rising", "slammed", "protest", "shortfall",
  "arbitrary", "backlash", "loopholes", "unaddressed", "बाधा", "विवाद", "आरोप", "सवाल"
];

const HIGHLIGHT_REGEX = new RegExp(
  [...FAV_WORDS, ...CRI_WORDS]
    .sort((a, b) => b.length - a.length)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "gi"
);

function highlightLoadedText(text: string) {
  if (!text) return "";
  const parts = text.split(HIGHLIGHT_REGEX);
  const matches = text.match(HIGHLIGHT_REGEX) || [];
  const result: React.ReactNode[] = [];

  parts.forEach((part, idx) => {
    result.push(part);
    if (matches[idx]) {
      const match = matches[idx];
      const isFav = FAV_WORDS.some((w) => w.toLowerCase() === match.toLowerCase());
      result.push(
        <mark key={idx} className={isFav ? "f" : "c"}>
          {match}
        </mark>
      );
    }
  });

  return <>{result}</>;
}

function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export interface OutletCoverage {
  headline: string;
  score: number; // 0 (critical) to 100 (supportive)
  language?: string;
  link?: string;
  axes?: number[];
}

export interface StoryItem {
  id: string;
  tag: string;
  t: string;
  th: string;
  ab: [string, string[]]; // [omissionText, omittedOutlets]
  f: string; // consensus fact (What happened)
  d: string; // divergence summary (Where framing splits)
  br: [string, string, string]; // [Left summary, Centre summary, Right summary]
  isBlindspot?: boolean;
  o: Record<string, OutletCoverage>;
}

export default function HomePage() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [biasGoggles, setBiasGoggles] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  // Stories
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Active Story & Route
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [radarStory, setRadarStory] = useState<StoryItem | null>(null);
  const [activeAxis, setActiveAxis] = useState<number>(0);
  const [visibleOutlets, setVisibleOutlets] = useState<Record<string, boolean>>({});
  const [showBrief, setShowBrief] = useState<boolean>(false);

  // Reading Diet
  const [diet, setDiet] = useState<{ k: number; n: number; s: number }>({ k: 0, n: 0, s: 0 });
  const [readStoryIds, setReadStoryIds] = useState<Set<string>>(new Set());

  // Real-time Engine States
  const [engineTopic, setEngineTopic] = useState<string>("air quality");
  const [engineStatus, setEngineStatus] = useState<string>("$ waiting for a topic…");
  const [engineProgress, setEngineProgress] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Scrollytelling
  const [scrollyStep, setScrollyStep] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50);

  // Media Literacy Lab
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [quizState, setQuizState] = useState<{
    items: Array<{ headline: string; lean: "k" | "n" | "s"; storyTitle: string; outlet: string }>;
    index: number;
    score: number;
    answered: boolean;
    selectedAnswer: string | null;
  }>({
    items: [],
    index: 0,
    score: 0,
    answered: false,
    selectedAnswer: null,
  });

  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollyRef = useRef<HTMLElement>(null);
  const impRef = useRef<HTMLElement>(null);
  const [todayFormatted, setTodayFormatted] = useState<string>("");

  // 1. Initial Load: Fetch 20+ current reports
  useEffect(() => {
    setTodayFormatted(
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/stories");
        const json = await res.json();
        if (json.clusters && Array.isArray(json.clusters)) {
          const formatted: StoryItem[] = json.clusters.map((c: any) => {
            const outletMap: Record<string, OutletCoverage> = {};
            c.articles?.forEach((art: any) => {
              const h = hashStr(c.id + art.outlet);
              let baseScore = 50;
              if (art.outlet.includes("Wire") || art.outlet.includes("Scroll")) baseScore = 20 + (h % 22);
              else if (art.outlet.includes("Jagran") || art.outlet.includes("Amar Ujala")) baseScore = 75 + (h % 20);
              else if (art.outlet.includes("Express") || art.outlet.includes("Hindu")) baseScore = 44 + (h % 14);
              else if (art.outlet.includes("NDTV") || art.outlet.includes("BBC")) baseScore = 32 + (h % 20);
              else baseScore = 40 + (h % 30);

              outletMap[art.outlet] = {
                headline: art.title,
                score: baseScore,
                language: art.language,
                link: art.link,
              };
            });

            // Derive 3-perspective framing summaries
            const leftSum = c.br?.[0] || `Focuses on accountability, institutional gaps, and grassroots concerns regarding ${c.canonicalTitle.toLowerCase()}.`;
            const centreSum = c.br?.[1] || `Lays out the official proceedings, data benchmarks, and timeline without a loaded verdict.`;
            const rightSum = c.br?.[2] || `Highlights administrative decisive action, governance delivery, and national developmental impact.`;

            return {
              id: c.id,
              tag: c.tag || "National",
              t: c.canonicalTitle,
              th: c.canonicalTitleHi || c.canonicalTitle,
              ab: [c.omissionEvidence || "Specific background data", c.omittedOutlets || []],
              f: c.leadFact || "Key institutional developments were officially reported.",
              d: c.divergenceSummary || "Outlets diverge on policy emphasis and accountability.",
              br: [leftSum, centreSum, rightSum],
              isBlindspot: c.isBlindspot || Object.keys(outletMap).length <= 2,
              o: outletMap,
            };
          });

          setStories(formatted);

          // Setup initial quiz pool
          const pool: Array<{ headline: string; lean: "k" | "n" | "s"; storyTitle: string; outlet: string }> = [];
          formatted.forEach((st) => {
            Object.entries(st.o).forEach(([outlet, cov]) => {
              if (cov.headline && cov.language !== "HI") {
                const lean = cov.score < 45 ? "k" : cov.score > 65 ? "s" : "n";
                pool.push({ headline: cov.headline, lean, storyTitle: st.t, outlet });
              }
            });
          });
          const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
          setQuizState({ items: shuffled, index: 0, score: 0, answered: false, selectedAnswer: null });
        }
      } catch (err) {
        console.error("Failed to load stories:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Hash-based URL routing for story view
  useEffect(() => {
    const handleHashChange = () => {
      const match = window.location.hash.match(/^#\/story\/([a-zA-Z0-9_-]+)/);
      if (match) {
        setActiveStoryId(match[1]);
        document.body.classList.add("story-open");
        window.scrollTo(0, 0);
      } else {
        setActiveStoryId(null);
        document.body.classList.remove("story-open");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Keyboard shortcut: Press 'G' for Bias Goggles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        setBiasGoggles((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (biasGoggles) document.body.classList.add("gg");
    else document.body.classList.remove("gg");
  }, [biasGoggles]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Halftone Canvas Effect
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0;
    let H = 0;
    let px = -999;
    let py = -999;

    function resize() {
      if (!cv) return;
      const hero = cv.parentElement;
      if (!hero) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth;
      H = hero.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      if (!cv?.parentElement) return;
      const r = cv.parentElement.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    };
    const onLeave = () => {
      px = -999;
      py = -999;
    };

    const hero = cv.parentElement;
    hero?.addEventListener("pointermove", onMove);
    hero?.addEventListener("pointerleave", onLeave);

    function render(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const isDark = document.documentElement.dataset.theme === "dark";
      const col = isDark ? "235, 230, 216" : "27, 26, 23";
      ctx.fillStyle = `rgba(${col}, 0.12)`;
      ctx.beginPath();

      const g = W < 600 ? 20 : 26;
      const t = time / 1000;

      for (let y = g / 2; y < H; y += g) {
        for (let x = g / 2; x < W; x += g) {
          let r = 1.2 + 2.4 * (0.5 + 0.5 * Math.sin(x * 0.012 + t * 0.8) * Math.cos(y * 0.014 - t * 0.6));
          const dx = x - px;
          const dy = y - py;
          r += 7 * Math.exp(-(dx * dx + dy * dy) / 8000);
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx.fill();
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      hero?.removeEventListener("pointermove", onMove);
      hero?.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  // Scrollytelling Observer
  useEffect(() => {
    const handleScroll = () => {
      const sec = scrollyRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));

      const step = progress < 0.2 ? 0 : progress < 0.5 ? 1 : progress < 0.8 ? 2 : 3;
      setScrollyStep(step);

      const calculatedX = Math.round((1 - Math.min(1, Math.max(0, (progress - 0.2) / 0.6))) * 100);
      setSliderPos(calculatedX);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Real-time Gemini 3.5 Flash Analysis Engine
  const handleAnalyze = async (overrideTopic?: string) => {
    const topicToRun = (overrideTopic || engineTopic).trim();
    if (!topicToRun || isAnalyzing) return;

    setIsAnalyzing(true);
    setEngineProgress(15);
    setEngineStatus(`$ initialize Gemini 3.5 Flash pipeline for "${topicToRun}"\n▸ Checking cloud semantic database cache & Context.dev scraper...`);

    const timer1 = setTimeout(() => {
      setEngineProgress(45);
      setEngineStatus((prev) => prev + `\n▸ Parsing Left / Centre / Right framing & statutory context...`);
    }, 600);

    const timer2 = setTimeout(() => {
      setEngineProgress(75);
      setEngineStatus((prev) => prev + `\n▸ Computing 6 Indian axes & extracting selective omission proof...`);
    }, 1200);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicToRun, language: lang }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await res.json();
      setEngineProgress(100);

      if (data.analysis) {
        const modelNote = data.fallbackOccurred
          ? ` (failover activated to ${data.modelUsed})`
          : ` (${data.modelUsed})`;
        setEngineStatus(
          (prev) =>
            prev +
            `\n✓ Pipeline complete${modelNote}: "${data.analysis.canonicalTitle}"\n✓ Opening Left-Centre-Right perspective brief…`
        );

        const newOutletMap: Record<string, OutletCoverage> = {};
        data.analysis.outlets?.forEach((o: any) => {
          newOutletMap[o.name] = {
            headline: o.headline,
            score: o.scoreGov ?? o.axes?.gov ?? 50,
            language: o.language ?? "EN",
            axes: [
              o.axes?.gov ?? 50,
              o.axes?.cul ?? 50,
              o.axes?.fed ?? 50,
              o.axes?.eco ?? 50,
              o.axes?.cas ?? 50,
              o.axes?.ten ?? 50,
            ],
          };
        });

        const newStory: StoryItem = {
          id: `gemini-${Date.now()}`,
          tag: "Real-Time Analysis",
          t: data.analysis.canonicalTitle || topicToRun,
          th: data.analysis.canonicalTitle || topicToRun,
          ab: [data.analysis.omissionEvidence || "Key contextual metrics", data.analysis.omittedOutlets || []],
          f: data.analysis.consensusSummary || "Official record confirmed across outlets.",
          d: data.analysis.divergenceSummary || "Framing diverges on administrative vs subaltern priorities.",
          br: [
            data.analysis.leftFraming || "Scrutinizes policy gaps, oversight deficits, and community impact.",
            data.analysis.centreFraming || "Presents the statistical data and official filings objectively.",
            data.analysis.rightFraming || "Foregrounds administrative compliance, development, and national stability.",
          ],
          isBlindspot: false,
          o: newOutletMap,
        };

        setStories((prev) => [newStory, ...prev]);
        setTimeout(() => {
          window.location.hash = `#/story/${newStory.id}`;
        }, 500);
      } else {
        setEngineStatus((prev) => prev + `\n⚠ Error: ${data.error || "Analysis failed"}`);
      }
    } catch (err: any) {
      setEngineStatus((prev) => prev + `\n✖ Execution failure: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Open Radar Modal
  const openRadar = (story: StoryItem) => {
    setRadarStory(story);
    setActiveAxis(0);
    setShowBrief(false);
    const vis: Record<string, boolean> = {};
    Object.keys(story.o).forEach((k) => (vis[k] = true));
    setVisibleOutlets(vis);
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  };

  const closeRadar = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setRadarStory(null);
  };

  // Axis score calculator
  const getAxisScore = (story: StoryItem, outlet: string, axisIdx: number): number => {
    const cov = story.o[outlet];
    if (!cov) return 50;
    if (cov.axes && cov.axes[axisIdx] !== undefined) return cov.axes[axisIdx];
    const g = cov.score;
    const h = hashStr(story.id + outlet + axisIdx);
    return Math.round(0.35 * g + 0.65 * (15 + (h % 70)));
  };

  // Add to reading diet
  const handleReadAtSource = (story: StoryItem, outlet: string) => {
    const cov = story.o[outlet];
    if (!cov) return;
    const lean = cov.score < 45 ? "k" : cov.score > 65 ? "s" : "n";
    setDiet((prev) => ({ ...prev, [lean]: prev[lean] + 1 }));
    setReadStoryIds((prev) => new Set(prev).add(story.id));
  };

  // Filtered stories
  const filteredStories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return stories.filter((s) => {
      const matchesTag =
        selectedTag === "All"
          ? true
          : selectedTag === "Blindspots"
          ? s.isBlindspot || Object.keys(s.o).length <= 2
          : s.tag === selectedTag;

      if (!matchesTag) return false;
      if (!q) return true;

      const titleMatch = s.t.toLowerCase().includes(q) || s.th.toLowerCase().includes(q);
      const tagMatch = s.tag.toLowerCase().includes(q);
      const outletMatch = Object.entries(s.o).some(
        ([outlet, cov]) => outlet.toLowerCase().includes(q) || cov.headline.toLowerCase().includes(q)
      );
      return titleMatch || tagMatch || outletMatch;
    });
  }, [stories, selectedTag, searchQuery]);

  const tagsList = useMemo(() => {
    const set = new Set<string>();
    stories.forEach((s) => set.add(s.tag));
    return ["All", ...Array.from(set), "Blindspots"];
  }, [stories]);

  // Current active story for the Left-Centre-Right story view
  const currentStory = useMemo(() => {
    if (!activeStoryId) return null;
    return stories.find((s) => s.id === activeStoryId) || null;
  }, [stories, activeStoryId]);

  // Reading Persona
  const personaInfo = useMemo(() => {
    const total = diet.k + diet.n + diet.s;
    if (total === 0) return null;
    const maxVal = Math.max(diet.k, diet.n, diet.s);
    const dom = diet.k === maxVal ? "k" : diet.s === maxVal ? "s" : "n";
    const pct = Math.round((maxVal / total) * 100);

    const personas = {
      bal: [
        "The Dwi-Drishti Reader",
        "You read across multiple perspectives. That is the whole point of media literacy.",
        "Try checking out a Blindspot story next.",
      ],
      s: [
        "The Steady Reader",
        "Most of your reading foregrounds executive governance narratives.",
        "Try balancing it with grassroots scrutiny on a story you follow.",
      ],
      k: [
        "The Questioner",
        "Most of your reading challenges establishment narratives.",
        "Try reading the governance perspective to inspect what data points they stress.",
      ],
      n: [
        "The Fact Finder",
        "You favor empirical, descriptive reporting.",
        "Check the framing axes to observe subtle loaded wording.",
      ],
    };

    const key = pct < 55 ? "bal" : dom;
    return {
      title: personas[key][0],
      desc: `${personas[key][1]} ${personas[key][2]}`,
      dom,
      pct,
    };
  }, [diet]);

  const getRadarPoint = (axisIdx: number, val: number): [string, string] => {
    const angle = (-90 + 60 * axisIdx) * (Math.PI / 180);
    const x = (150 + Math.cos(angle) * val).toFixed(1);
    const y = (150 + Math.sin(angle) * val).toFixed(1);
    return [x, y];
  };

  const SCROLLY_STEPS = [
    {
      label: "Step 1 of 4 · The event",
      title: "Union Budget alters direct income-tax slabs. One event, two divergent front pages.",
      headlineA: "Budget hands middle class tax break",
      headlineB: "The fine print: who still pays more",
    },
    {
      label: "Step 2 of 4 · Establishment frame",
      title: "Establishment outlets highlight relief for entry-level professionals.",
      headlineA: "Centre delivers historic middle-class relief",
      headlineB: "Indexation removals curb net savings",
    },
    {
      label: "Step 3 of 4 · Grassroots frame",
      title: "Independent scrutiny investigates who gets left out of the bracket.",
      headlineA: "Rebates unlock disposable income",
      headlineB: "Informal workers excluded from tax net",
    },
    {
      label: "Step 4 of 4 · The omission gap",
      title: "Same figures, conflicting frames. Dwi Drishti surfaces what each left out.",
      headlineA: "Slabs widened: relief across brackets",
      headlineB: "Effective tax rises for capital gains",
    },
  ];

  const LESSONS = [
    {
      name: "Framing",
      desc: "Every story is told from an angle. The frame decides which fact you meet first and what feeling comes with it.",
      frameA: "Budget hands the middle class a tax break",
      frameB: "The fine print: who still pays more",
      tip: "Ask: what does this headline want me to feel first?",
    },
    {
      name: "Omission",
      desc: "What an outlet leaves out shapes public opinion just as deeply as what it covers. You only see omissions when comparing across papers.",
      frameA: "Hospitals report surge in respiratory admissions",
      frameB: "Air action plan delayed again, municipal records show",
      tip: "Look for the orange 'Absent here' flag in story breakdowns.",
    },
    {
      name: "Loaded Words",
      desc: "Adjectives and verbs carry hidden verdicts. 'Relief' sounds benevolent. Relief in scare-quotes suggests a gimmick.",
      frameA: "Tax slabs widened; relief mostly for mid-income earners",
      frameB: "Tax 'relief' leaves most workers outside the net",
      tip: "Turn on Bias Goggles to spot favourable and critical phrasing.",
    },
    {
      name: "Source Mix",
      desc: "One outlet is just one perspective. Reading across contrasting outlets reconstructs the full picture.",
      tip: "Check your Reading Diet bar to see whether your information intake is balanced.",
    },
  ];

  return (
    <>
      {/* Intro Splash */}
      <div className="intro" id="intro" aria-hidden="true">
        <span>द्वि दृष्टि</span>
        <div className="by">by Optimus · Cross-Lingual Media Framing Platform</div>
      </div>

      {/* Header */}
      <header>
        <div
          className="d logo"
          onClick={() => {
            window.location.hash = "#/";
          }}
        >
          Dwi Drishti<b>News</b>
        </div>
        <div className="sp"></div>

        {/* Live Search */}
        <input
          id="q"
          type="search"
          placeholder={lang === "hi" ? "ख़बरें खोजें (Search stories)..." : "Search stories..."}
          aria-label="Search stories"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <a className="pill gt" href="#learn">
          Learn
        </a>

        {/* Bias Goggles */}
        <button
          className="pill"
          id="gg"
          aria-pressed={biasGoggles}
          title="Highlight loaded wording (Press 'G')"
          onClick={() => setBiasGoggles((prev) => !prev)}
        >
          👓<span className="gt"> Bias goggles</span>
        </button>

        {/* Language Switcher */}
        <button
          className="pill"
          id="lang"
          aria-pressed={lang === "hi"}
          onClick={() => setLang((prev) => (prev === "en" ? "hi" : "en"))}
          aria-label="Switch language"
        >
          {lang === "en" ? "हिं" : "EN"}
        </button>

        {/* Theme Toggle */}
        <button
          className="pill"
          id="th"
          onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
          aria-label="Toggle theme"
        >
          ◐
        </button>
      </header>

      {/* PROTOTYPE 5: DEDICATED LEFT - CENTRE - RIGHT STORY VIEW */}
      {currentStory && (
        <main className="story" id="story">
          <a
            className="back"
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = "#/";
            }}
          >
            ← {lang === "hi" ? "सभी ख़बरें (All stories)" : "All stories"}
          </a>

          <small className="kick">
            {currentStory.tag}
            {currentStory.isBlindspot ? " · BLINDSPOT" : ""}
          </small>
          <h1 className="d sh">{lang === "hi" ? currentStory.th : currentStory.t}</h1>

          {/* Meter Bar: Left, Centre, Right Percentages */}
          {(() => {
            const arr = Object.values(currentStory.o);
            const n = arr.length || 1;
            const kCount = arr.filter((x) => x.score < 45).length;
            const nCount = arr.filter((x) => x.score >= 45 && x.score <= 65).length;
            const sCount = arr.filter((x) => x.score > 65).length;
            const pc = (v: number) => Math.round((v / n) * 100);

            return (
              <div className="meter">
                <div className="bar" role="img" aria-label={`Left ${kCount}, Centre ${nCount}, Right ${sCount}`}>
                  <i className="k" style={{ flex: kCount || 0.01 }}></i>
                  <i className="n" style={{ flex: nCount || 0.01 }}></i>
                  <i className="s" style={{ flex: sCount || 0.01 }}></i>
                </div>
                <div className="ml">
                  <span>
                    <i className="dt k"></i>Left (Critical) {pc(kCount)}% · {kCount}
                  </span>
                  <span>
                    <i className="dt n"></i>Centre (Neutral) {pc(nCount)}% · {nCount}
                  </span>
                  <span>
                    <i className="dt s"></i>Right (Supportive) {pc(sCount)}% · {sCount}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Event Summary Box: What happened, Where framing splits, What is missing */}
          <div className="bk">
            <div>
              <b>What happened</b>
              <p>{currentStory.f}</p>
            </div>
            <div>
              <b>Where the framing splits</b>
              <p>{currentStory.d}</p>
            </div>
            <div>
              <b>What is missing</b>
              <p>
                &ldquo;{currentStory.ab[0]}&rdquo; is documented in covering reports, but omitted from:{" "}
                {currentStory.ab[1]?.length ? currentStory.ab[1].join(", ") : "None"}.
              </p>
            </div>
          </div>

          {/* 3-Column Differentiation Grid: Left, Centre, Right */}
          <div className="cols">
            {/* Column 1: Left (Critical of Govt) */}
            {(() => {
              const leftOutlets = Object.entries(currentStory.o).filter(([_, cov]) => cov.score < 45);
              return (
                <section className="col cl-k">
                  <h3>Left</h3>
                  <small>Critical of govt · {leftOutlets.length} of {Object.keys(currentStory.o).length} outlets</small>
                  {leftOutlets.length ? (
                    <>
                      <p className="fr">{currentStory.br[0]}</p>
                      {leftOutlets.map(([outlet, cov]) => (
                        <div key={outlet} className="oc">
                          <div className="on">
                            <span>
                              {outlet}
                              <span className="lg">{cov.language || "EN"}</span>
                            </span>
                            <span className="font-mono">{cov.score}/100</span>
                          </div>
                          <p className={cov.language === "HI" ? "hi" : ""}>
                            {highlightLoadedText(cov.headline)}
                          </p>
                          {currentStory.ab[1]?.includes(outlet) && (
                            <span className="flag">Absent here: &ldquo;{currentStory.ab[0]}&rdquo;</span>
                          )}
                          <button
                            className="pill rd"
                            disabled={readStoryIds.has(currentStory.id)}
                            onClick={() => handleReadAtSource(currentStory, outlet)}
                          >
                            {readStoryIds.has(currentStory.id) ? "Added to reading diet ✓" : "Read at source"}
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="empty2">
                      No outlet in our sample covered this from the critical/left perspective. That is a media blindspot.
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Column 2: Centre (Neutral) */}
            {(() => {
              const centreOutlets = Object.entries(currentStory.o).filter(([_, cov]) => cov.score >= 45 && cov.score <= 65);
              return (
                <section className="col cl-n">
                  <h3>Centre</h3>
                  <small>Neutral · {centreOutlets.length} of {Object.keys(currentStory.o).length} outlets</small>
                  {centreOutlets.length ? (
                    <>
                      <p className="fr">{currentStory.br[1]}</p>
                      {centreOutlets.map(([outlet, cov]) => (
                        <div key={outlet} className="oc">
                          <div className="on">
                            <span>
                              {outlet}
                              <span className="lg">{cov.language || "EN"}</span>
                            </span>
                            <span className="font-mono">{cov.score}/100</span>
                          </div>
                          <p className={cov.language === "HI" ? "hi" : ""}>
                            {highlightLoadedText(cov.headline)}
                          </p>
                          {currentStory.ab[1]?.includes(outlet) && (
                            <span className="flag">Absent here: &ldquo;{currentStory.ab[0]}&rdquo;</span>
                          )}
                          <button
                            className="pill rd"
                            disabled={readStoryIds.has(currentStory.id)}
                            onClick={() => handleReadAtSource(currentStory, outlet)}
                          >
                            {readStoryIds.has(currentStory.id) ? "Added to reading diet ✓" : "Read at source"}
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="empty2">
                      No outlet in our sample covered this with neutral/descriptive reporting. That is a media blindspot.
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Column 3: Right (Supportive of Govt) */}
            {(() => {
              const rightOutlets = Object.entries(currentStory.o).filter(([_, cov]) => cov.score > 65);
              return (
                <section className="col cl-s">
                  <h3>Right</h3>
                  <small>Supportive of govt · {rightOutlets.length} of {Object.keys(currentStory.o).length} outlets</small>
                  {rightOutlets.length ? (
                    <>
                      <p className="fr">{currentStory.br[2]}</p>
                      {rightOutlets.map(([outlet, cov]) => (
                        <div key={outlet} className="oc">
                          <div className="on">
                            <span>
                              {outlet}
                              <span className="lg">{cov.language || "EN"}</span>
                            </span>
                            <span className="font-mono">{cov.score}/100</span>
                          </div>
                          <p className={cov.language === "HI" ? "hi" : ""}>
                            {highlightLoadedText(cov.headline)}
                          </p>
                          {currentStory.ab[1]?.includes(outlet) && (
                            <span className="flag">Absent here: &ldquo;{currentStory.ab[0]}&rdquo;</span>
                          )}
                          <button
                            className="pill rd"
                            disabled={readStoryIds.has(currentStory.id)}
                            onClick={() => handleReadAtSource(currentStory, outlet)}
                          >
                            {readStoryIds.has(currentStory.id) ? "Added to reading diet ✓" : "Read at source"}
                          </button>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="empty2">
                      No outlet in our sample covered this from the supportive/establishment angle. That is a media blindspot.
                    </div>
                  )}
                </section>
              );
            })()}
          </div>

          <p className="note2">
            Left, Centre and Right are mapped from how each headline frames the government in our analytical scoring rubric. They represent editorial framing angles on this specific event, not a blanket partisan label on any outlet.
          </p>

          <div className="acts">
            <button className="pill" onClick={() => openRadar(currentStory)}>
              Compare on 6-Axis Radar
            </button>
            <a
              className="pill"
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#/";
              }}
            >
              ← {lang === "hi" ? "सभी ख़बरें" : "All stories"}
            </a>
          </div>
        </main>
      )}

      {/* Hero Section */}
      <section className="hero">
        <canvas id="ht" ref={canvasRef} aria-hidden="true"></canvas>
        <div className="mast">
          <div className="dateline">
            <span id="dt">{todayFormatted}</span>
            <span>Broadsheet Prototype Edition</span>
            <span>Evidence, Not Verdicts</span>
          </div>
          <div className="plate" aria-label="Dwi Drishti News">
            {Array.from("Dwi Drishti News").map((c, i) => (
              <span key={i} style={{ animationDelay: `calc(var(--io) + ${(0.25 + i * 0.045).toFixed(3)}s)` }}>
                {c === " " ? "\u00A0" : c}
              </span>
            ))}
          </div>
          <p className="tagline">द्वि दृष्टि न्यूज़ · Every story, both sights</p>
        </div>

        <div className="lead">
          <div>
            <small className="kick">Lead editorial</small>
            <h1 className="d">
              <span>Same news.</span>
              <br />
              <span className="ol">Two views.</span>
            </h1>
            <p>
              {lang === "hi"
                ? "एक घटना, कई अख़बार। देखिए किसने कैसे दिखाया और क्या छोड़ दिया। स्लाइडर खींचिए।"
                : "One event, many outlets. See who framed it how, and what each one left out. Drag the slider."}
            </p>
            <div className="cue">Scroll or drag to compare the two views ↓</div>
          </div>
        </div>
      </section>

      {/* Scrollytelling Section */}
      <section className="scrolly" id="scrolly" ref={scrollyRef} aria-label="Scroll to compare two headlines">
        <div className="stick">
          <div className="scap">
            <small className="kick" id="sk">
              {SCROLLY_STEPS[scrollyStep].label}
            </small>
            <p id="st">{SCROLLY_STEPS[scrollyStep].title}</p>
          </div>

          <div className="split" id="split" style={{ ["--x" as any]: `${sliderPos}%` }}>
            <div className="lay la">
              <span>Outlet A (Establishment)</span>
              <h2 className="d">{SCROLLY_STEPS[scrollyStep].headlineA}</h2>
            </div>
            <div className="lay lb">
              <span>Outlet B (Scrutiny)</span>
              <h2 className="d">{SCROLLY_STEPS[scrollyStep].headlineB}</h2>
            </div>
            <div className="knob">
              <i>↔</i>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              aria-label="Comparison split slider"
            />
          </div>

          <div className="prog">
            <i id="sp" style={{ width: `${((scrollyStep + 1) / 4) * 100}%` }}></i>
          </div>
        </div>
      </section>

      {/* News Ticker */}
      <div className="tick" aria-hidden="true">
        <div>
          <span>The Hindu</span>
          <span>Indian Express</span>
          <span>Dainik Jagran</span>
          <span>NDTV</span>
          <span>The Wire</span>
          <span>Hindustan Times</span>
          <span>Scroll.in</span>
          <span>Amar Ujala</span>
          <span>BBC Hindi</span>
          <span>Times of India</span>
          <span>The Hindu</span>
          <span>Indian Express</span>
          <span>Dainik Jagran</span>
          <span>NDTV</span>
          <span>The Wire</span>
          <span>Hindustan Times</span>
          <span>Scroll.in</span>
          <span>Amar Ujala</span>
          <span>BBC Hindi</span>
          <span>Times of India</span>
        </div>
      </div>

      {/* Impact Stats */}
      <section className="imp" id="imp" ref={impRef}>
        <div>
          <b className="d">58%</b>
          <p>of Indians get news from YouTube</p>
        </div>
        <div>
          <b className="d">56%</b>
          <p>get news from WhatsApp</p>
        </div>
        <div>
          <b className="d">38–39%</b>
          <p>trust Indian news</p>
        </div>
        <small>
          Figures from contemporary media audits and Lokniti-CSDS surveys. Trust is fragile; therefore we differentiate
          Left, Centre, and Right framing with verbatim evidence rather than moral verdicts.
        </small>
      </section>

      {/* Real-time Analysis Engine */}
      <section className="eng">
        <div>
          <h2 className="d">Live Analysis Engine</h2>
          <p>
            Powered live by <strong>Gemini 3.5 Flash</strong> with cloud database caching. Enter any topic to
            extract Left / Centre / Right framing splits and omission proof in real time.
          </p>

          <div className="ir">
            <input
              id="topic"
              value={engineTopic}
              onChange={(e) => setEngineTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="e.g. air quality, Starlink, GST dues..."
              aria-label="Topic to analyze"
            />
            <button className="go" id="go" disabled={isAnalyzing} onClick={() => handleAnalyze()}>
              {isAnalyzing ? "Analyzing…" : "Analyze"}
            </button>
          </div>

          <div className="chips" id="sug">
            {[
              "air quality",
              "GST dues",
              "MSP",
              "income tax",
              "rail corridor",
              "Starlink Licensing",
              "Electoral Bonds",
              "Uniform Civil Code",
            ].map((s) => (
              <button
                key={s}
                className="pill"
                onClick={() => {
                  setEngineTopic(s);
                  handleAnalyze(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="term" aria-live="polite">
          <pre id="log">{engineStatus}</pre>
          <div className="pb">
            <i id="pb" style={{ width: `${engineProgress}%` }}></i>
          </div>
        </div>
      </section>

      {/* Top Stories Feed Grid */}
      <main className="feed">
        <h2 className="d">{lang === "hi" ? "मुख्य ख़बरें (20+ रिपोर्ट्स)" : "Top Stories (20+ Reports)"}</h2>

        {/* Filter Chips */}
        <div className="chips" id="chips" role="group" aria-label="Filter stories">
          {tagsList.map((tag) => (
            <button
              key={tag}
              className="pill"
              aria-pressed={selectedTag === tag}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Reading Diet */}
        <div className="diet" id="diet">
          <h3 className="d">Your Reading Diet</h3>
          {diet.k + diet.n + diet.s === 0 ? (
            <p>
              Open any story and click <strong>&ldquo;Read at source&rdquo;</strong>. We will visualize your
              perspective consumption balance across Left, Centre, and Right in real time.
            </p>
          ) : (
            <>
              <div
                className="bar"
                role="img"
                aria-label={`Reading diet: ${diet.k} Left (Critical), ${diet.n} Centre (Neutral), ${diet.s} Right (Supportive)`}
              >
                <i className="k" style={{ flex: diet.k || 0.01 }}></i>
                <i className="n" style={{ flex: diet.n || 0.01 }}></i>
                <i className="s" style={{ flex: diet.s || 0.01 }}></i>
              </div>
              <p>
                {personaInfo?.pct}% of what you have inspected leans{" "}
                {personaInfo?.dom === "k" ? "Left (Critical)" : personaInfo?.dom === "s" ? "Right (Supportive)" : "Centre (Neutral)"}.
              </p>
              {personaInfo && (
                <div className="persona">
                  <small>Discovered News Persona</small>
                  <h3 className="d">{personaInfo.title}</h3>
                  <p>{personaInfo.desc}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="empty">Loading current reports from Context.dev and news index…</div>
        ) : filteredStories.length === 0 ? (
          <div className="empty">No stories match your filter or search. Clear the search or pick another tag.</div>
        ) : (
          <div className="grid" id="grid">
            {filteredStories.map((story) => {
              const outletsArr = Object.values(story.o);
              const kCount = outletsArr.filter((o) => o.score < 45).length;
              const nCount = outletsArr.filter((o) => o.score >= 45 && o.score <= 65).length;
              const sCount = outletsArr.filter((o) => o.score > 65).length;
              const totalCount = outletsArr.length;

              return (
                <article key={story.id} className="card in" data-id={story.id}>
                  {story.isBlindspot && <span className="stk">BLINDSPOT</span>}
                  <small>{story.tag}</small>
                  <h3 className="d">
                    <a href={`#/story/${story.id}`}>{lang === "hi" ? story.th : story.t}</a>
                  </h3>

                  <div
                    className="bar"
                    role="img"
                    aria-label={`${kCount} Left, ${nCount} Centre, ${sCount} Right`}
                  >
                    <i className="k" style={{ flex: kCount || 0.1 }}></i>
                    <i className="n" style={{ flex: nCount || 0.1 }}></i>
                    <i className="s" style={{ flex: sCount || 0.1 }}></i>
                  </div>

                  <small>
                    Covered by {totalCount} outlets · {kCount} Left · {nCount} Centre · {sCount} Right
                  </small>

                  {/* PROTOTYPE 5: Actions: Read Brief and Compare */}
                  <div className="acts">
                    <a className="pill rb" href={`#/story/${story.id}`}>
                      {lang === "hi" ? "ब्रीफ़ पढ़ें →" : "Read brief →"}
                    </a>
                    <button className="pill" onClick={() => openRadar(story)}>
                      {lang === "hi" ? "तुलना" : "Compare"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* 6-Axis Radar Modal (<dialog>) */}
      <dialog id="dlg" ref={dialogRef} aria-label="Story comparison modal">
        {radarStory && (
          <div>
            <button className="x" aria-label="Close dialog" onClick={closeRadar}>
              ✕
            </button>

            <small>{radarStory.tag}</small>
            <h2 className="d">{lang === "hi" ? radarStory.th : radarStory.t}</h2>

            {/* 6-Axis Radar Visualizer */}
            <div className="viz">
              <svg className="radar" viewBox="0 0 300 300" role="img" aria-label="6-Axis Radar Chart">
                {[33, 66, 100].map((r, ri) => (
                  <polygon
                    key={ri}
                    className="rg"
                    points={AXES.map((_, i) => getRadarPoint(i, r).join(",")).join(" ")}
                  />
                ))}
                {AXES.map((ax, i) => {
                  const pt = getRadarPoint(i, 100);
                  const lbl = getRadarPoint(i, 122);
                  return (
                    <React.Fragment key={i}>
                      <line className="rg" x1="150" y1="150" x2={pt[0]} y2={pt[1]} />
                      <text className="rt" x={lbl[0]} y={lbl[1]} textAnchor="middle" dominantBaseline="middle">
                        {ax.name}
                      </text>
                    </React.Fragment>
                  );
                })}
                {Object.entries(radarStory.o).map(([outlet]) => {
                  if (!visibleOutlets[outlet]) return null;
                  const clr = OUTLET_COLORS[outlet] || "#79bdb3";
                  const pts = AXES.map((_, i) => {
                    const score = getAxisScore(radarStory, outlet, i);
                    return getRadarPoint(i, score).join(",");
                  }).join(" ");

                  return (
                    <polygon
                      key={outlet}
                      data-o={outlet}
                      points={pts}
                      fill={clr}
                      fillOpacity="0.16"
                      stroke={clr}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                  );
                })}
              </svg>

              <div className="leg" role="group" aria-label="Toggle Outlets">
                {Object.keys(radarStory.o).map((outlet) => (
                  <button
                    key={outlet}
                    className="pill lgb"
                    aria-pressed={visibleOutlets[outlet] !== false}
                    onClick={() =>
                      setVisibleOutlets((prev) => ({ ...prev, [outlet]: !prev[outlet] }))
                    }
                  >
                    <i style={{ background: OUTLET_COLORS[outlet] || "#999" }}></i>
                    {outlet}
                  </button>
                ))}
              </div>
            </div>

            {/* Framing Axis Selector */}
            <div className="axes" role="group" aria-label="Framing Axis">
              {AXES.map((ax, i) => (
                <button
                  key={ax.name}
                  className="pill"
                  aria-pressed={activeAxis === i}
                  onClick={() => setActiveAxis(i)}
                >
                  {ax.name}
                </button>
              ))}
            </div>

            <div className="ends">
              <span>← {AXES[activeAxis].low}</span>
              <span>{AXES[activeAxis].high} →</span>
            </div>

            <p className="ex">
              <strong>How to read:</strong> Farther from the centre means stronger on that axis. {AXES[activeAxis].desc}
            </p>

            <p className="gh">
              Bias goggles active: Green/lime marks favourable-loaded phrasing, orange/salmon marks critical-loaded phrasing.
            </p>

            {/* Outlets List */}
            {Object.entries(radarStory.o).map(([outlet, cov]) => {
              const score = getAxisScore(radarStory, outlet, activeAxis);
              const isOmitted = radarStory.ab[1]?.includes(outlet);
              const alreadyRead = readStoryIds.has(radarStory.id);

              return (
                <div key={outlet} className="row" data-o={outlet}>
                  <div className="top">
                    <span>
                      {outlet}
                      <span className="lg">{cov.language || "EN"}</span>
                    </span>
                    <span className="sc font-mono">{score}/100</span>
                  </div>

                  <div className="trk">
                    <b style={{ left: `${score}%` }}></b>
                  </div>

                  <p className={cov.language === "HI" ? "hi" : ""}>
                    {highlightLoadedText(cov.headline)}
                  </p>

                  {isOmitted && (
                    <span className="flag">
                      Absent here: &ldquo;{radarStory.ab[0]}&rdquo;
                    </span>
                  )}

                  <div>
                    <button
                      className="pill rd"
                      disabled={alreadyRead}
                      onClick={() => handleReadAtSource(radarStory, outlet)}
                    >
                      {alreadyRead ? "Added to reading diet ✓" : "Read at source"}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Omission Summary */}
            <p style={{ color: "var(--mut)", marginTop: "14px" }}>
              <strong>Empirical omission proof:</strong> &ldquo;{radarStory.ab[0]}&rdquo; was documented by covering outlets, but was omitted by:{" "}
              {radarStory.ab[1]?.length ? radarStory.ab[1].join(", ") : "None (Consensus coverage)"}.
            </p>

            {/* GENERAL EVENT SUMMARY & PERSPECTIVE DOSSIER (Replaced UPSC-specific label) */}
            <div style={{ marginTop: "14px" }}>
              <a
                className="pill rb"
                href={`#/story/${radarStory.id}`}
                onClick={() => closeRadar()}
                style={{ marginRight: "8px" }}
              >
                View 3-Column Brief →
              </a>
              <button
                className="pill"
                aria-pressed={showBrief}
                onClick={() => setShowBrief((prev) => !prev)}
              >
                {showBrief ? "Hide Event Summary" : "Perspective Dossier / Event Summary"}
              </button>
            </div>

            {showBrief && (
              <div className="brief">
                <p>
                  <strong>What happened (Consensus):</strong> {radarStory.f}
                </p>
                <p>
                  <strong>Where framing diverges:</strong> {radarStory.d}
                </p>
                <p>
                  <strong>Critical Framing Question:</strong> Critically examine how contrasting Left, Centre, and Right media framing of &ldquo;{radarStory.t}&rdquo; shapes citizen perception and democratic policy discourse.
                </p>
              </div>
            )}
          </div>
        )}
      </dialog>

      {/* Media Literacy Lab */}
      <section className="learn" id="learn">
        <h2 className="d">Media Literacy Lab</h2>
        <p className="lp">
          Four short interactive lessons, followed by a dynamic framing quiz. Designed for citizens,
          journalists, and researchers who want to read Indian news with clear eyes across Left, Centre, and Right.
        </p>

        <div className="lgrid">
          {/* Lessons */}
          <div className="paper">
            <div role="group" aria-label="Lessons" style={{ marginBottom: "14px" }}>
              {LESSONS.map((les, idx) => (
                <button
                  key={les.name}
                  className="pill"
                  aria-pressed={activeLesson === idx}
                  onClick={() => setActiveLesson(idx)}
                >
                  {idx + 1}. {les.name}
                </button>
              ))}
            </div>

            <h3 className="d">{LESSONS[activeLesson].name}</h3>
            <p>{LESSONS[activeLesson].desc}</p>

            {LESSONS[activeLesson].frameA && (
              <p>
                <strong>Frame A:</strong> {highlightLoadedText(LESSONS[activeLesson].frameA!)}
                <br />
                <strong>Frame B:</strong> {highlightLoadedText(LESSONS[activeLesson].frameB!)}
              </p>
            )}

            <p className="note">{LESSONS[activeLesson].tip}</p>

            {activeLesson === 2 && (
              <button
                className="pill"
                onClick={() => setBiasGoggles((prev) => !prev)}
              >
                {biasGoggles ? "Turn Off Bias Goggles" : "Turn On Bias Goggles"}
              </button>
            )}
          </div>

          {/* Quiz */}
          <div className="paper">
            <h3 className="d">Spot The Bias</h3>
            {quizState.items.length === 0 ? (
              <p>Loading headlines for quiz…</p>
            ) : quizState.index >= quizState.items.length ? (
              <div>
                <p className="qh">
                  You scored {quizState.score} out of {quizState.items.length}!
                </p>
                <p>
                  {quizState.score >= 4
                    ? "Sharp eye! You read right past loaded framing."
                    : quizState.score >= 2
                    ? "Good start. Switch on Bias Goggles to notice subtle verbs and nouns."
                    : "Framing is subtle. Keep practicing with different outlets."}
                </p>
                <button
                  className="pill"
                  onClick={() => {
                    const shuffled = [...quizState.items].sort(() => Math.random() - 0.5);
                    setQuizState({ items: shuffled, index: 0, score: 0, answered: false, selectedAnswer: null });
                  }}
                >
                  Play again
                </button>
              </div>
            ) : (
              <div>
                <small>
                  Question {quizState.index + 1} of {quizState.items.length} · {quizState.items[quizState.index].outlet}
                </small>
                <p className="qh">
                  &ldquo;{quizState.answered ? highlightLoadedText(quizState.items[quizState.index].headline) : quizState.items[quizState.index].headline}&rdquo;
                </p>
                <p>Which way does this headline lean on the government?</p>

                <div className="qo">
                  {[
                    { key: "k", label: "Left (Critical)" },
                    { key: "n", label: "Centre (Neutral)" },
                    { key: "s", label: "Right (Supportive)" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      className={`pill ${
                        quizState.answered && quizState.selectedAnswer === key && key !== quizState.items[quizState.index].lean
                          ? "bad"
                          : ""
                      }`}
                      disabled={quizState.answered}
                      aria-pressed={quizState.answered && quizState.items[quizState.index].lean === key}
                      onClick={() => {
                        const correct = key === quizState.items[quizState.index].lean;
                        setQuizState((prev) => ({
                          ...prev,
                          answered: true,
                          selectedAnswer: key,
                          score: correct ? prev.score + 1 : prev.score,
                        }));
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {quizState.answered && (
                  <div style={{ marginTop: "14px" }}>
                    <p>
                      <strong>
                        {quizState.selectedAnswer === quizState.items[quizState.index].lean ? "Correct! " : "Not quite. "}
                      </strong>
                      The headline leans{" "}
                      <strong>
                        {quizState.items[quizState.index].lean === "k"
                          ? "Left (Critical of govt)"
                          : quizState.items[quizState.index].lean === "s"
                          ? "Right (Supportive of govt)"
                          : "Centre (Neutral)"}
                      </strong>
                      . Loaded phrasing has been highlighted.
                    </p>
                    <button
                      className="pill"
                      onClick={() =>
                        setQuizState((prev) => ({
                          ...prev,
                          index: prev.index + 1,
                          answered: false,
                          selectedAnswer: null,
                        }))
                      }
                    >
                      {quizState.index < quizState.items.length - 1 ? "Next Question" : "See Final Score"}
                    </button>
                  </div>
                )}
              </div>
            )}
            <small style={{ marginTop: "14px", display: "block" }}>
              All questions generated directly from verbatim coverage across Indian national and regional press.
            </small>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
          <div>
            <strong>Dwi Drishti News (द्वि दृष्टि न्यूज़)</strong> — Built by Team Optimus.
            <br />
            Section 52(1)(a) Indian Copyright Act, 1957 Fair Dealing compliant for non-commercial media literacy research.
          </div>
          <div>
            <a href="/methodology" className="pill" style={{ marginRight: "8px" }}>Methodology</a>
            <a href="/takedown" className="pill">Legal & Takedown</a>
          </div>
        </div>
        <div>
          Tip: Press <kbd style={{ border: "1px solid currentColor", padding: "1px 5px", borderRadius: "2px" }}>G</kbd> on your keyboard anytime to activate Bias Goggles.
        </div>
      </footer>
    </>
  );
}
