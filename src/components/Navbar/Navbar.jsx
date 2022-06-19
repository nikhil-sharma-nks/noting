import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context';
import './navbar.scss';
import { useAuth, useNote } from '../../context';
import { makeToast } from '../../components';
import NOTING_ICON from '../../assets/noting-icon.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { authState, authDispatch } = useAuth();
  const { noteDispatch } = useNote();
  const handleLogout = () => {
    makeToast('You Are Now Logged Out', 'success');
    authDispatch({
      type: 'LOGOUT',
    });
    noteDispatch({ type: 'LOGOUT' });
    navigate('/');
  };
  return (
    <div className='navigationbar-container'>
      <div className='navbar'>
        <Link to='/'>
          <div className='navbar-header'>
            <img src={NOTING_ICON} alt='noting icon' className='navbar-icon' />
            <div className='h2 color-primary'>Noting</div>
          </div>
        </Link>
        <div className='navigation-buttons'>
          <div className='theme-container' onClick={toggleTheme}>
            {theme === 'light' ? (
              <i className='fa-regular fa-moon'></i>
            ) : (
              <i className='fa-solid fa-sun'></i>
            )}
          </div>
          {authState.isAuth && authState.token ? (
            <div className='dropdown'>
              <div className='avatar-text avatar-circular avatar-small'>
                {authState.user.firstName.charAt(0).toUpperCase() +
                  authState.user.lastName.charAt(0).toUpperCase()}
              </div>
              <div className='dropdown-content'>
                <div>Profile</div>
                <div onClick={handleLogout}>Logout</div>
              </div>
            </div>
          ) : (
            <Link to='/login'>
              <button className='btn btn-primary-outlined'>Login</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export { Navbar };
