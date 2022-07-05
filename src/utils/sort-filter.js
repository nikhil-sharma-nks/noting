const sortByDate = (sortBy, notes) => {
  if (sortBy === '')
    return notes.sort((a, b) => {
      const date_a = new Date(a.createdAt);
      const date_b = new Date(b.createdAt);
      return date_b - date_a;
    });

  if (sortBy === 'date-latest') {
    const dateLatestNotes = notes.sort((a, b) => {
      const date_a = new Date(a.createdAt);
      const date_b = new Date(b.createdAt);
      return date_b - date_a;
    });
    return dateLatestNotes;
  } else if (sortBy === 'date-oldest') {
    const dateOldestNotes = notes.sort((a, b) => {
      const date_a = new Date(a.createdAt);
      const date_b = new Date(b.createdAt);
      return date_a - date_b;
    });
    return dateOldestNotes;
  }
};

const getAllLowPriority = (notes) =>
  notes.filter((note) => note.priority === 'low');
const getAllMediumPriority = (notes) =>
  notes.filter((note) => note.priority === 'medium');
const getAllHighPriority = (notes) =>
  notes.filter((note) => note.priority === 'high');

const sortByPriority = (sortBy, notes) => {
  if (sortBy === '') return notes;
  switch (sortBy) {
    case 'low': {
      return getAllLowPriority(notes);
    }
    case 'medium': {
      return getAllMediumPriority(notes);
    }
    case 'high': {
      return getAllHighPriority(notes);
    }
    case 'low-to-high': {
      const low = getAllLowPriority(notes);
      const medium = getAllMediumPriority(notes);
      const high = getAllHighPriority(notes);
      return [...low, ...medium, ...high];
    }
    case 'high-to-low': {
      const low = getAllLowPriority(notes);
      const medium = getAllMediumPriority(notes);
      const high = getAllHighPriority(notes);
      return [...high, ...medium, ...low];
    }
    default:
      return notes;
  }
};

const isExists = (tagsSet, note) => {
  let flag = false;
  for (let i = 0; i < note.tags.length; i++) {
    if (tagsSet.has(note.tags[i])) {
      flag = true;
      return true;
    }
  }
  return flag;
};

const filterByTags = (tags, notes) => {
  if (tags.length === 0) return notes;
  const tagsSet = new Set(tags);
  return notes.filter((note) => isExists(tagsSet, note));
};

export { sortByDate, sortByPriority, filterByTags };
