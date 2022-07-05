const filterBySearch = (searchQuery, notes) => {
  if (searchQuery === '') return notes;
  return notes.filter(
    (note) =>
      note.title.includes(searchQuery) || note.textContent.includes(searchQuery)
  );
};

export { filterBySearch };
