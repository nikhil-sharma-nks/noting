import React, { useEffect } from 'react';
import './notesContainer.scss';
import { useNote } from '../../../context';
import { getAllLabels } from '../../../utils';
import { FilterSearch } from '../../';
const NotesContainer = ({ children }) => {
  const { noteState, noteDispatch } = useNote([]);
  useEffect(() => {
    const allLabels = getAllLabels([...noteState.notes, ...noteState.archives]);
    noteDispatch({ type: 'LOAD_LABELS', payload: allLabels });
  }, []);
  return (
    <>
      <div className='notes-container pb-5'>
        <FilterSearch />
        {children}
      </div>
    </>
  );
};

export { NotesContainer };
