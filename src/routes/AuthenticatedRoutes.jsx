import React from 'react';
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { makeToast } from '../components';

const AuthenticatedRoutes = () => {
  const isAuth = JSON.parse(localStorage.getItem('isAuth'));
  const location = useLocation();

  if (isAuth) {
    return <Outlet />;
  } else {
    makeToast('Please Login First', 'error');
    return (
      <Navigate
        to='/login'
        replace={true}
        state={{ from: location.pathname }}
      />
    );
  }
};

export default AuthenticatedRoutes;
