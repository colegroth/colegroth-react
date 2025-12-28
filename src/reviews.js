// The ** suffix allows Vite to search through all subfolders
const modules = import.meta.glob('./content/**/*.js', { eager: true });

export const reviews = Object.entries(modules).map(([path, module]) => {
  const fileName = path.split('/').pop().replace('.js', '');
  const data = module.default || Object.values(module)[0];
  
  return {
    ...data,
    // ID defaults to the filename if not explicitly set in the object
    id: data.id || fileName 
  };
})
// Sorts primarily by date, then alphabetically by title for same-day posts
.sort((a, b) => {
  const dateCompare = new Date(b.publishedDate) - new Date(a.publishedDate);
  if (dateCompare !== 0) return dateCompare;
  return a.title.localeCompare(b.title);
});