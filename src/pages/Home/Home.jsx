import React, { useEffect } from 'react';
import './home.scss';
import {
  Layout,
  NoteCardView,
  EditNote,
  NotesContainer,
  NoteCard,
} from '../../components';
import { useNote } from '../../context';

const Home = () => {
  const { noteState, noteDispatch } = useNote();
  const { isEditorModalOpen, isNewNoteOpen } = noteState;

  useEffect(() => {
    if (!noteState.isNewNoteOpen) {
      noteDispatch({ type: 'OPEN_NEW_NOTE' });
    }
  }, []);
  return (
    <>
      <Layout>
        {isEditorModalOpen && <EditNote />}
        <NotesContainer>
          {isNewNoteOpen && <NoteCard />}
          {noteState.notes?.map((note) => (
            <NoteCardView key={note._id} note={note} />
          ))}
          {noteState.notes.length === 0 && (
            <p className='text-centered text-xl mt-4'>
              No Notes Here, Please Add One!
            </p>
          )}
        </NotesContainer>
      </Layout>
    </>
  );
};

export { Home };
