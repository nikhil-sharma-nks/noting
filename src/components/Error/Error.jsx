import React from 'react';
import ERROR_IMAGE from './error-img.svg';
import './error.scss';
const Error = ({ children, imageOfNotFound }) => {
  return (
    <div className='error-container'>
      <img src={ERROR_IMAGE} alt='error' className='error-image'></img>
      <div className='info-container '>{children}</div>
    </div>
  );
};

export { Error };
