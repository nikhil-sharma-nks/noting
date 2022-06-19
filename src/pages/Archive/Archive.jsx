import React, { useEffect } from 'react';
import './archive.scss';
import {
  Layout,
  NoteCardView,
  NotesContainer,
  EditNote,
  NoteCard,
} from '../../components';
import { useNote } from '../../context';

const Archive = () => {
  const { noteState, noteDispatch } = useNote();
  const { isEditorModalOpen, isNewNoteOpen } = noteState;

  useEffect(() => {
    if (noteState.isNewNoteOpen) {
      noteDispatch({ type: 'CLOSE_NEW_NOTE' });
    }
  }, []);
  return (
    <>
      <Layout>
        {isEditorModalOpen && <EditNote fromArchive />}
        <NotesContainer>
          {isNewNoteOpen && <NoteCard />}
          {noteState.archives?.map((note) => (
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
