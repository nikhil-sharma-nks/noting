import React, { useEffect, useState } from 'react';
import './archive.scss';
import {
  Layout,
  NoteCardView,
  NotesContainer,
  EditNote,
  NoteCard,
} from '../../components';
import { useNote } from '../../context';
import {
  filterBySearch,
  sortByDate,
  sortByPriority,
  filterByTags,
} from '../../utils';

const Archive = () => {
  const { noteState, noteDispatch } = useNote();
  const {
    isEditorModalOpen,
    isNewNoteOpen,
    filter,
    notes,
    labels,
    searchQuery,
    archives,
  } = noteState;
  const [notesToDisplay, setNotesToDisplay] = useState(archives || []);

  useEffect(() => {
    if (noteState.isNewNoteOpen) {
      noteDispatch({ type: 'CLOSE_NEW_NOTE' });
    }
  }, []);
  useEffect(() => {
    const notesFilterBySearch = filterBySearch(searchQuery, archives);
    const notesSortByDate = sortByDate(
      filter.sortBy?.value || '',
      notesFilterBySearch
    );
    const notesSortByPriority = sortByPriority(
      filter.filterPriority?.value || '',
      notesSortByDate
    );
    const notesFilterByTags = filterByTags(
      filter.filterTags || [],
      notesSortByPriority
    );
    setNotesToDisplay([...notesFilterByTags]);
  }, [filter, archives, labels, searchQuery]);
  return (
    <>
      <Layout>
        {isEditorModalOpen && <EditNote fromArchive />}
        <NotesContainer>
          {isNewNoteOpen && <NoteCard />}
          {notesToDisplay?.map((note) => (
            <NoteCardView key={note._id} note={note} fromArchive />
          ))}
          {noteState.archives.length === 0 && (
            <p className='text-centered text-xl mt-4'>No Archive Notes</p>
          )}
        </NotesContainer>
      </Layout>
    </>
  );
};

export { Archive };
