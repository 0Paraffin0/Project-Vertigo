import Constants from 'expo-constants';

const NEWS_API_KEY = Constants.expoConfig.extra.newsApiKey;
const BASE_URL = 'https://newsapi.org/v2';

const QUERIES = [
  'finance banking investment',
  'mergers acquisitions deals',
  'central bank interest rates inflation',
  'legal regulatory compliance enforcement',
  'private equity venture capital',
  'antitrust litigation court ruling',
  'fintech cryptocurrency digital assets',
  'stock market trading equities',
];

const SECTOR_QUERY_MAP = {
  'investment-banking':  'investment banking M&A deals',
  'asset-management':    'asset management funds BlackRock',
  'private-equity':      'private equity venture capital LBO',
  'hedge-funds':         'hedge fund trading',
  'retail-banking':      'retail banking lending credit',
  'fintech':             'fintech payments digital banking',
  'insurance':           'insurance reinsurance underwriting',
  'real-estate-finance': 'real estate property finance REIT',
  'trading':             'stock market trading equities bonds',
  'wealth-management':   'wealth management private banking',
  'crypto-digital':      'cryptocurrency bitcoin ethereum DeFi',
  'accounting':          'audit accounting Big4 Deloitte PwC',
  'corporate-law':       'corporate law M&A merger acquisition',
  'finance-law':         'banking finance law regulation',
  'capital-markets-law': 'capital markets securities law IPO',
  'litigation':          'litigation court ruling settlement',
  'regulatory':          'regulation enforcement FCA SEC compliance',
  'tax-law':             'tax law HMRC IRS transfer pricing',
  'ip-law':              'intellectual property patents technology law',
  'real-estate-law':     'real estate law property planning',
  'employment-law':      'employment law tribunal HR',
  'insolvency':          'insolvency restructuring bankruptcy administration',
  'competition-law':     'antitrust competition CMA DOJ cartel',
  'international-law':   'international law trade sanctions WTO',
};

function buildQueryFromProfile(userProfile) {
  if (userProfile.sectors && userProfile.sectors.length > 0) {
    const terms = userProfile.sectors
      .map((id) => SECTOR_QUERY_MAP[id])
      .filter(Boolean)
      .slice(0, 4)
      .join(' OR ');
    if (terms) return terms;
  }
  return 'finance law banking regulation markets investment';
}

export async function fetchRawHeadlines(userProfile) {
  const query = buildQueryFromProfile(userProfile);
  const url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&pageSize=30&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`NewsAPI error: ${response.status}`);

  const data = await response.json();

  return data.articles
    .filter((a) => a.title && a.description && a.url)
    .map((a) => ({
      title: a.title,
      description: a.description,
      source: a.source.name,
      url: a.url,
      publishedAt: a.publishedAt,
    }));
}
