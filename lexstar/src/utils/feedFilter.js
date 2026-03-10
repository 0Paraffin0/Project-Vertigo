export function filterArticles(articles, userProfile) {
  // If user has no sectors and no feedPrefs selected, show all articles
  if (userProfile.sectors.length === 0 && userProfile.feedPrefs.length === 0) {
    return articles;
  }

  return articles.filter((article) => {
    // Breaking news always shows regardless of filters
    if (article.breaking) return true;

    // Region filter — if user has regions selected, article must match at least one
    const regionMatch =
      userProfile.regions.length === 0 ||
      (article.regionIds || []).some((r) => userProfile.regions.includes(r));

    // Sector filter — if user has sectors selected, article must match at least one
    const sectorMatch =
      userProfile.sectors.length === 0 ||
      (article.sectorIds || []).some((s) => userProfile.sectors.includes(s));

    // Story type filter — if user has feedPrefs selected, article storyType must be included
    const typeMatch =
      userProfile.feedPrefs.length === 0 ||
      userProfile.feedPrefs.includes(article.storyType);

    return regionMatch && sectorMatch && typeMatch;
  });
}

export function sortArticles(articles) {
  // Breaking first, then by array order (proxy for recency)
  return [
    ...articles.filter((a) => a.breaking),
    ...articles.filter((a) => !a.breaking),
  ];
}
