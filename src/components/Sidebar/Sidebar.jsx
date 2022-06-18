import React from 'react';
import './sidebar.scss';
import { NavLink } from 'react-router-dom';
import { useNote } from '../../context';

const Sidebar = () => {
  const { noteDispatch } = useNote();
  const openNewNote = () => noteDispatch({ type: 'OPEN_NEW_NOTE' });
  const sidebarLinks = [
    {
      name: 'Home',
      link: '/home',
      icon: <i className='fa-solid fa-house mr-3'></i>,
    },
    {
      name: 'Labels',
      link: '/labels',
      icon: <i class='fa-solid fa-tag mr-3'></i>,
    },
    {
      name: 'Archive',
      link: '/archive',
      icon: <i class='fa-solid fa-box-archive mr-3'></i>,
    },
    {
      name: 'Trash',
      link: '/trash',
      icon: <i class='fa-solid fa-trash mr-3'></i>,
    },
    {
      name: 'Profile',
      link: '/profile',
      icon: <i class='fa-solid fa-user mr-3'></i>,
    },
  ];
  return (
    <>
      <div className='sidebar'>
        <ul className='sidebar-link-container'>
          {sidebarLinks.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  isActive ? 'link-item link-isActive' : 'link-item'
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <button className='btn btn-primary mt-3' onClick={openNewNote}>
          Add Note
        </button>
      </div>
    </>
  );
};

export { Sidebar };
