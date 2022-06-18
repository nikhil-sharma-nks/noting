import React from 'react';
import './home.scss';
import { Layout, NoteCardView } from '../../components';
import { useNote } from '../../context';

const Home = () => {
  const { noteState } = useNote();
  return (
    <>
      <Layout>
        {noteState.notes?.map((note) => (
          <NoteCardView key={note._id} note={note} />
        ))}
      </Layout>
    </>
  );
};

export { Home };
