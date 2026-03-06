export function applyDateFilter(articles, filter) {
  const now = Date.now();
  const DAY   = 86400000;
  const WEEK  = DAY * 7;
  const MONTH = DAY * 30;

  if (filter === 'all') return articles;

  const cutoff = {
    'today': now - DAY,
    'week':  now - WEEK,
    'month': now - MONTH,
  }[filter];

  return articles.filter(a => {
    const t = a.archivedAt?.toMillis?.() || new Date(a.time).getTime();
    return t > cutoff;
  });
}
