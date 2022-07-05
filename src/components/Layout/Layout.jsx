import React from 'react';
import './layout.scss';
import { Sidebar } from '../';
const Layout = ({ children }) => {
  return (
    <>
      <div className='app-layout'>
        <Sidebar />
        {children}
      </div>
    </>
  );
};

export { Layout };
