import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  LandingPage,
  Login,
  Signup,
  Home,
  Archive,
  Trash,
  Profile,
  ErrorPage,
} from '../pages';
import AuthenticatedRoutes from './AuthenticatedRoutes';

import Mockman from 'mockman-js';

const RoutesContainer = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />

      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/mock' element={<Mockman />} />

      <Route path='/' element={<AuthenticatedRoutes />}>
        <Route path='/home' element={<Home />} />
        <Route path='/archive' element={<Archive />} />
        <Route path='/trash' element={<Trash />} />
        <Route path='/profile' element={<Profile />} />
      </Route>
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  );
};

export default RoutesContainer;
