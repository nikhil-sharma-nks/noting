import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage, Login, Signup, Home } from '../pages';
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
      </Route>
    </Routes>
  );
};

export default RoutesContainer;
