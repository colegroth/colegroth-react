// src/data/reviews.js

// FIRST: Initialize the file scanners
const dailyFiles = import.meta.glob('./dailies/*.js', { eager: true });
const featureFiles = import.meta.glob('./features/*.js', { eager: true });

// SECOND: Define the processing logic
const processEntries = (files, type) => {
  return Object.values(files).map(module => {
    const data = module.default;
    if (!data) return null;

    return {
      ...data,
      // Clean URL: Use slug, fallback to title-slug, fallback to numeric ID
      id: data.slug || data.title?.toLowerCase().replace(/\s+/g, '-') || data.id,
      // Internal Sort: Keep the 001_ style for the sorting logic
      sortId: data.id || "", 
      type: type
    };
  }).filter(Boolean);
};

// THIRD: Execute the processing
const dailies = processEntries(dailyFiles, 'vault');
const features = processEntries(featureFiles, 'feature');

// FOURTH: Export the final sorted array
export const reviews = [...features, ...dailies].sort((a, b) => {
  return b.sortId.localeCompare(a.sortId, undefined, { numeric: true });
});