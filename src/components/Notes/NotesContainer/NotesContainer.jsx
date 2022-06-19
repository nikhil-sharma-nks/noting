import React from 'react';
import './notesContainer.scss';
const NotesContainer = ({ children }) => {
  return (
    <>
      <div className='notes-container'>{children}</div>
    </>
  );
};

export { NotesContainer };
