import React from 'react';
import './layout.scss';
import { Sidebar, NotesContainer } from '../';
const Layout = ({ children }) => {
  return (
    <>
      <div className='app-layout'>
        <Sidebar />
        <NotesContainer>{children}</NotesContainer>
      </div>
    </>
  );
};

export { Layout };
