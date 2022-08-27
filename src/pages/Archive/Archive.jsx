import React, { useEffect, useState } from 'react';
import './archive.scss';
import {
  Layout,
  NoteCardView,
  NotesContainer,
  EditNote,
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

const Archive = () => {
  const { noteState, noteDispatch } = useNote();
  const {
    isEditorModalOpen,
    isNewNoteOpen,
    filter,
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
          {notesToDisplay.length === 0 && (
            <Error>
              {!searchQuery ? (
                <>
                  <p className='text-xl'>No Archived Notes Available</p>
                  <p className='text-m'>
                    Notes that you have Archived added would appear here. Add
                    Now.
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

export { Archive };
