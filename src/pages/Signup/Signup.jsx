import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.scss';
import { signupUser } from '../../api';
import { makeToast, Spinner } from '../../components';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [signupInput, setSignupInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setSignupInput({
      ...signupInput,
      [name]: value,
    });
  };
  useEffect(() => {
    const isAuth = JSON.parse(localStorage.getItem('isAuth'));
    if (isAuth) {
      navigate('/home');
    }
  }, []);
  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    if (signupInput.password !== signupInput.confirmPassword) {
      makeToast("Password Doesn't match! Please Try Again", 'error');
      return;
    }
    setLoading(true);
    try {
      const data = await signupUser(signupInput);
      if (data) {
        makeToast('Signup successful, You can now log in!', 'success');
        navigate('/login');
      } else {
        setLoading(false);
        makeToast('Signup Failed, Try Again!', 'error');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      makeToast('SignUp Failed, Try Again!', 'error');
    }
  };

  return (
    <>
      <div className='auth-page'>
        <div className='signup-page-container'>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <form
                className='form-group'
                onSubmit={(event) => handleSignupSubmit(event)}
              >
                <p className='text-xxl text-centered color-primary'>Sign Up</p>
                <label htmlFor='signup_first_name' className='form-label'>
                  First Name
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='signup_first_name'
                  name='firstName'
                  placeholder='Enter your first name'
                  value={signupInput.firstName}
                  onChange={inputChangeHandler}
                  required
                />
                <label htmlFor='signup_last_name' className='form-label'>
                  Last Name
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='signup_last_name'
                  name='lastName'
                  placeholder='Enter your last name'
                  value={signupInput.lastName}
                  onChange={inputChangeHandler}
                  required
                />
                <label htmlFor='signup_email' className='form-label'>
                  Email address
                </label>
                <input
                  type='email'
                  className='form-control'
                  id='signup_email'
                  placeholder='Enter your email'
                  name='email'
                  onChange={inputChangeHandler}
                  value={signupInput.email}
                  required
                />
                <label htmlFor='signup_password' className='form-label'>
                  Password
                </label>
                <input
                  type='password'
                  className='form-control'
                  id='signup_password'
                  placeholder='Enter your password'
                  name='password'
                  onChange={inputChangeHandler}
                  value={signupInput.password}
                  required
                />
                <label htmlFor='signup_password_confirm' className='form-label'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  className='form-control'
                  id='signup_password_confirm'
                  placeholder='Conform your password'
                  name='confirmPassword'
                  onChange={inputChangeHandler}
                  value={signupInput.confirmPassword}
                  required
                />
                {signupInput.confirmPassword.length > 0 &&
                signupInput.confirmPassword === signupInput.password ? (
                  <p className='feedback feedback-success'>Password Matched!</p>
                ) : signupInput.confirmPassword.length > 0 ? (
                  <p className='feedback feedback-error'>
                    Password Not Matched
                  </p>
                ) : (
                  ''
                )}

                <div className='form-options-container mt-4'>
                  <div>
                    <input
                      type='checkbox'
                      id='rememberMe'
                      name='subscribe'
                      value='newsletter'
                    />
                    <label className='ml-1' htmlFor='rememberMe'>
                      I accept all terms and conditions
                    </label>
                  </div>
                </div>
                <button className='btn btn-primary mt-3' type='submit'>
                  Sign Up
                </button>
                <div className='mt-3 text-centered'>
                  <Link to='/login' className='sign-up-link'>
                    Already Have An Account, Sign In!
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export { Signup };
