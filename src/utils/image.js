export const optimizeImage = (url, width = 780) => {
  if (!url || !url.includes('tmdb.org')) return url;
  // Replace 'original' with specific width (w500, w780, w1280)
  return url.replace('/original/', `/w${width}/`);
};