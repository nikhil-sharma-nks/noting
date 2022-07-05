import React, { useEffect, useState } from 'react';
import './trash.scss';
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

const Trash = () => {
  const { noteState, noteDispatch } = useNote();
  const {
    isEditorModalOpen,
    isNewNoteOpen,
    filter,
    notes,
    labels,
    searchQuery,
    trash,
  } = noteState;
  const [notesToDisplay, setNotesToDisplay] = useState(trash || []);
  useEffect(() => {
    const notesFilterBySearch = filterBySearch(searchQuery, trash);
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
  }, [filter, trash, labels, searchQuery]);

  return (
    <>
      <Layout>
        <NotesContainer>
          {notesToDisplay?.map((note) => (
            <NoteCardView key={note._id} note={note} fromTrash />
          ))}
          {noteState.trash.length === 0 && (
            <p className='text-centered text-xl mt-4'>Nothing In Trash</p>
          )}
        </NotesContainer>
      </Layout>
    </>
  );
};

export { Trash };
