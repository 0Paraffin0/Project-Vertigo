/*
 * LEXSTAR — Markets data
 * Static mock data for Phase 3. Phase 7 replaces with live Alpha Vantage feeds.
 */

// ─── EXCHANGES ────────────────────────────────────────────────────────────────
export const EXCHANGES = [
  {
    id: "nyse",
    name: "NYSE",
    fullName: "New York Stock Exchange",
    flag: "🇺🇸",
    utcOffset: -5,
    index: "Dow Jones",
    value: 38547.10,
    change: +234.56,
    changePct: +0.61,
    sparkline: [38102, 38245, 38180, 38390, 38315, 38490, 38547],
  },
  {
    id: "nasdaq",
    name: "Nasdaq",
    fullName: "Nasdaq Composite",
    flag: "🇺🇸",
    utcOffset: -5,
    index: "Nasdaq",
    value: 15832.45,
    change: -89.23,
    changePct: -0.56,
    sparkline: [16100, 16050, 15980, 15900, 15855, 15870, 15832],
  },
  {
    id: "lse",
    name: "LSE",
    fullName: "London Stock Exchange",
    flag: "🇬🇧",
    utcOffset: 0,
    index: "FTSE 100",
    value: 7682.10,
    change: +31.45,
    changePct: +0.41,
    sparkline: [7601, 7622, 7648, 7639, 7658, 7671, 7682],
  },
  {
    id: "hkex",
    name: "HKEX",
    fullName: "Hong Kong Stock Exchange",
    flag: "🇭🇰",
    utcOffset: 8,
    index: "Hang Seng",
    value: 17234.56,
    change: -156.78,
    changePct: -0.90,
    sparkline: [17598, 17502, 17448, 17401, 17378, 17261, 17234],
  },
  {
    id: "euronext",
    name: "Euronext",
    fullName: "Euronext Paris",
    flag: "🇪🇺",
    utcOffset: 1,
    index: "CAC 40",
    value: 7892.34,
    change: +45.67,
    changePct: +0.58,
    sparkline: [7800, 7821, 7839, 7858, 7872, 7881, 7892],
  },
  {
    id: "asx",
    name: "ASX",
    fullName: "Australian Securities Exchange",
    flag: "🇦🇺",
    utcOffset: 11,
    index: "ASX 200",
    value: 7612.80,
    change: +28.90,
    changePct: +0.38,
    sparkline: [7562, 7572, 7581, 7591, 7600, 7608, 7612],
  },
  {
    id: "tsx",
    name: "TSX",
    fullName: "Toronto Stock Exchange",
    flag: "🇨🇦",
    utcOffset: -5,
    index: "TSX Composite",
    value: 21345.67,
    change: +112.34,
    changePct: +0.53,
    sparkline: [21102, 21153, 21198, 21251, 21281, 21319, 21345],
  },
  {
    id: "nikkei",
    name: "Nikkei",
    fullName: "Tokyo Stock Exchange",
    flag: "🇯🇵",
    utcOffset: 9,
    index: "Nikkei 225",
    value: 38923.45,
    change: -234.56,
    changePct: -0.60,
    sparkline: [39198, 39102, 38997, 39048, 38982, 38951, 38923],
  },
];

// ─── TOP MOVERS (keyed by exchange id) ───────────────────────────────────────
export const MARKET_MOVERS = {
  nyse: {
    gainers: [
      { symbol: "JPM",  name: "JPMorgan Chase",   changePct: +2.31 },
      { symbol: "GS",   name: "Goldman Sachs",     changePct: +1.87 },
      { symbol: "BAC",  name: "Bank of America",   changePct: +1.54 },
    ],
    losers: [
      { symbol: "C",    name: "Citigroup",          changePct: -1.42 },
      { symbol: "WFC",  name: "Wells Fargo",         changePct: -0.98 },
      { symbol: "AIG",  name: "AIG",                 changePct: -0.76 },
    ],
  },
  nasdaq: {
    gainers: [
      { symbol: "NVDA", name: "NVIDIA",              changePct: +3.10 },
      { symbol: "MSFT", name: "Microsoft",           changePct: +1.22 },
      { symbol: "AMZN", name: "Amazon",              changePct: +0.95 },
    ],
    losers: [
      { symbol: "META", name: "Meta Platforms",      changePct: -1.65 },
      { symbol: "NFLX", name: "Netflix",             changePct: -1.04 },
      { symbol: "PYPL", name: "PayPal",              changePct: -0.88 },
    ],
  },
  lse: {
    gainers: [
      { symbol: "HSBA", name: "HSBC Holdings",       changePct: +1.92 },
      { symbol: "SHEL", name: "Shell",               changePct: +1.44 },
      { symbol: "AZN",  name: "AstraZeneca",         changePct: +0.87 },
    ],
    losers: [
      { symbol: "LLOY", name: "Lloyds Banking",      changePct: -1.12 },
      { symbol: "BP",   name: "BP",                  changePct: -0.79 },
      { symbol: "RIO",  name: "Rio Tinto",           changePct: -0.54 },
    ],
  },
  hkex: {
    gainers: [
      { symbol: "0700", name: "Tencent Holdings",    changePct: +1.35 },
      { symbol: "9988", name: "Alibaba Group",       changePct: +0.98 },
      { symbol: "1299", name: "AIA Group",           changePct: +0.72 },
    ],
    losers: [
      { symbol: "0939", name: "CCB",                 changePct: -1.88 },
      { symbol: "0005", name: "HSBC (HK)",           changePct: -1.23 },
      { symbol: "2318", name: "Ping An Insurance",   changePct: -0.91 },
    ],
  },
  euronext: {
    gainers: [
      { symbol: "BNP",  name: "BNP Paribas",         changePct: +1.64 },
      { symbol: "AIR",  name: "Airbus",              changePct: +1.18 },
      { symbol: "SAN",  name: "Sanofi",              changePct: +0.76 },
    ],
    losers: [
      { symbol: "SG",   name: "Société Générale",    changePct: -1.55 },
      { symbol: "CA",   name: "Crédit Agricole",     changePct: -0.93 },
      { symbol: "RNO",  name: "Renault",             changePct: -0.61 },
    ],
  },
  asx: {
    gainers: [
      { symbol: "CBA",  name: "Commonwealth Bank",   changePct: +1.44 },
      { symbol: "BHP",  name: "BHP Group",           changePct: +1.07 },
      { symbol: "CSL",  name: "CSL Limited",         changePct: +0.83 },
    ],
    losers: [
      { symbol: "NAB",  name: "Natl Australia Bank",  changePct: -0.97 },
      { symbol: "ANZ",  name: "ANZ Group",            changePct: -0.72 },
      { symbol: "WBC",  name: "Westpac Banking",      changePct: -0.58 },
    ],
  },
  tsx: {
    gainers: [
      { symbol: "RY",   name: "Royal Bank of Canada", changePct: +1.31 },
      { symbol: "TD",   name: "TD Bank",              changePct: +1.05 },
      { symbol: "CNR",  name: "Canadian Natl Railway", changePct: +0.79 },
    ],
    losers: [
      { symbol: "BNS",  name: "Bank of Nova Scotia",  changePct: -1.14 },
      { symbol: "SU",   name: "Suncor Energy",        changePct: -0.88 },
      { symbol: "MFC",  name: "Manulife Financial",   changePct: -0.63 },
    ],
  },
  nikkei: {
    gainers: [
      { symbol: "7203", name: "Toyota Motor",         changePct: +0.91 },
      { symbol: "6758", name: "Sony Group",           changePct: +0.74 },
      { symbol: "9984", name: "SoftBank Group",       changePct: +0.58 },
    ],
    losers: [
      { symbol: "8306", name: "Mitsubishi UFJ",        changePct: -1.79 },
      { symbol: "9432", name: "NTT",                  changePct: -1.12 },
      { symbol: "6501", name: "Hitachi",              changePct: -0.84 },
    ],
  },
};

// ─── MARKET NEWS ──────────────────────────────────────────────────────────────
export const MARKET_NEWS = [
  {
    id: "mn1",
    category: "markets",
    headline: "Wall Street Opens Higher on Strong Jobs Data",
    time: "12m ago",
    exchange: "nyse",
    sources: ["Reuters", "Bloomberg", "WSJ"],
    verified: true,
  },
  {
    id: "mn2",
    category: "markets",
    headline: "Tech Rally Lifts Nasdaq Above Key 16,000 Level",
    time: "45m ago",
    exchange: "nasdaq",
    sources: ["FT", "Bloomberg", "CNBC"],
    verified: true,
  },
  {
    id: "mn3",
    category: "markets",
    headline: "FTSE Gains as Sterling Weakens Against Dollar",
    time: "1h ago",
    exchange: "lse",
    sources: ["Reuters", "The Times", "BBC Business"],
    verified: true,
  },
  {
    id: "mn4",
    category: "markets",
    headline: "Hang Seng Slides as China Property Worries Persist",
    time: "2h ago",
    exchange: "hkex",
    sources: ["Bloomberg", "SCMP", "Reuters"],
    verified: true,
  },
  {
    id: "mn5",
    category: "markets",
    headline: "CAC 40 Edges Up on ECB Rate-Cut Optimism",
    time: "2h ago",
    exchange: "euronext",
    sources: ["Reuters", "Le Monde", "FT"],
    verified: true,
  },
];
