const filterBySearch = (searchQuery, notes) => {
  if (searchQuery.trim() === '') return notes;
  return notes.filter(
    (note) =>
      note.title.includes(searchQuery.trim()) ||
      note.textContent.includes(searchQuery.trim())
  );
};

export { filterBySearch };
