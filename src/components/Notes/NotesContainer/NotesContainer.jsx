import React from 'react';
import './notesContainer.scss';
import { NoteCard, EditNote } from '../../';
import { useNote } from '../../../context';

const NotesContainer = ({ children }) => {
  const { noteState } = useNote();
  const { isEditorModalOpen } = noteState;
  return (
    <>
      {isEditorModalOpen && <EditNote />}
      <div className='notes-container'>
        <NoteCard />
        {children}
      </div>
    </>
  );
};

export { NotesContainer };
