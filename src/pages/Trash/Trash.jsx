import React, { useEffect, useState } from 'react';
import './trash.scss';
import {
  Layout,
  NoteCardView,
  NotesContainer,
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

const Trash = () => {
  const { noteState, noteDispatch } = useNote();
  const { filter, labels, searchQuery, trash } = noteState;
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
          {notesToDisplay.length === 0 && (
            <Error>
              {!searchQuery ? (
                <>
                  <p className='text-xl'>No Notes In Trash </p>
                  <p className='text-m'>
                    Notes that you have deleted added would appear here.
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

export { Trash };
