const getAllLabels = (allNotes) => {
  const collection = allNotes.reduce((prev, current) => {
    return [...prev, ...current.tags];
  }, []);
  return collection;
};

export { getAllLabels };
