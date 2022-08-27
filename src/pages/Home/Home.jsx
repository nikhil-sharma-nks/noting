import React, { useEffect, useState } from 'react';
import './home.scss';
import {
  Layout,
  NoteCardView,
  EditNote,
  NotesContainer,
  NoteCard,
  Error,
  makeToast,
} from '../../components';
import { useNote } from '../../context';
import {
  filterBySearch,
  sortByDate,
  sortByPriority,
  filterByTags,
} from '../../utils';

const Home = () => {
  const { noteState, noteDispatch } = useNote();
  const {
    isEditorModalOpen,
    isNewNoteOpen,
    filter,
    notes,
    labels,
    searchQuery,
  } = noteState;
  const [notesToDisplay, setNotesToDisplay] = useState(notes || []);

  useEffect(() => {
    if (!noteState.isNewNoteOpen) {
      noteDispatch({ type: 'OPEN_NEW_NOTE' });
    }
  }, []);

  useEffect(() => {
    const notesFilterBySearch = filterBySearch(searchQuery, notes);
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
  }, [filter, notes, labels, searchQuery]);
  return (
    <>
      <Layout>
        {isEditorModalOpen && <EditNote />}
        <NotesContainer>
          {isNewNoteOpen && <NoteCard />}
          {notesToDisplay?.map((note) => (
            <NoteCardView key={note._id} note={note} />
          ))}
          {notesToDisplay.length === 0 && (
            <Error>
              {!searchQuery ? (
                <>
                  <p className='text-xl'>No Notes Available</p>
                  <p className='text-m'>
                    Notes that you have added would appear here. Add Now.
                  </p>
                </>
              ) : (
                <>
                  <p className='text-xl'>No Notes Found On Search</p>
                  <div>
                    <button
                      className='btn btn-primary'
                      onClick={() => {
                        noteDispatch({
                          type: 'SEARCH_QUERY',
                          payload: '',
                        });
                        noteDispatch({ type: 'CLEAR_FILTER' });
                        makeToast('Search And Filter Cleared', 'success');
                      }}
                    >
                      Clear Search And Filters
                    </button>
                  </div>
                </>
              )}
            </Error>
          )}
        </NotesContainer>
      </Layout>
    </>
  );
};

export { Home };
