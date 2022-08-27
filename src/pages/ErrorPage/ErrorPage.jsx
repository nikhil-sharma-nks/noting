import React from 'react';
import { Error } from '../../components';
import { Link } from 'react-router-dom';
import './errorPage.scss';

const ErrorPage = () => {
  return (
    <div className='error-page theme-background'>
      <Error>
        <p className='text-l'>ERROR 404 : PAGE NOT FOUND</p>
        <Link to='/home'>
          <button type='submit' className='btn btn-primary'>
            Go To Home
          </button>
        </Link>
      </Error>
    </div>
  );
};

export { ErrorPage };
