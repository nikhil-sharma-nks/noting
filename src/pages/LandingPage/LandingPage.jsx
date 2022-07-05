import React from 'react';
import './landingPage.scss';
import LANDING_HERO_IMG from '../../assets/landing-hero-img.svg';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <div className='landing-page'>
        <div className='landing-page-text-container landing-flex-item'>
          <p className='text-xxl color-primary mb-5'>Noting</p>
          <p className='text-l mb-3'>A Note Taking App</p>
          <p className='mb-2'>
            Noting is your one stop destination for all your note taking needs.
          </p>
          <p className='mb-5'>
            Take Notes, Sort, Filter, Label We've Got It All
          </p>
          <div className='mb-3'>
            <Link to='/home'>
              <button className='btn btn-primary'>Start Now</button>
            </Link>
          </div>
          <p>
            <Link to='/signup'> Don't Have An Account? Sign Up Now</Link>
          </p>
        </div>
        <img
          src={LANDING_HERO_IMG}
          alt='landing hero'
          className='landing-page-img-container landing-flex-item'
        />
      </div>
    </>
  );
};

export { LandingPage };
