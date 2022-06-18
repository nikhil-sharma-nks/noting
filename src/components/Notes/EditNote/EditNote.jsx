import React from 'react';
import { NoteCard } from '../../';
import './editNote.scss';

const EditNote = () => {
  return (
    <div className='edit-note-backdrop'>
      <NoteCard fromEdit />
    </div>
  );
};

export { EditNote };
