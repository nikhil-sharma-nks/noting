import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import { loginUser } from '../../api';
import { useAuth } from '../../context';
import { makeToast, Spinner } from '../../components';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { authDispatch } = useAuth();
  const [loginInput, setLoginInput] = useState({
    email: '',
    password: '',
  });
  const testCredentials = {
    email: 'nikhil.harsh.sharma@gmail.com',
    password: 'nikhil123',
  };

  const loginHandler = async (event, loginInput) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(loginInput);
      if (data) {
        makeToast('Login successful!', 'success');
        const { encodedToken, foundUser } = data;
        const authData = {
          token: encodedToken,
          user: foundUser,
          isAuth: true,
        };

        delete authData.user.password;
        delete authData.user.confirmPassword;
        authDispatch({ type: 'LOGIN_USER', payload: authData });
        navigate('/home');
      } else {
        setLoading(false);
        makeToast('Login Failed, Try Again!', 'error');
      }
    } catch (error) {
      makeToast('Login Failed, Try Again!', 'error');
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginInput((input) => ({
      ...input,
      [name]: value,
    }));
  };
  const selectTestCredentials = (event) => {
    event.preventDefault();
    setLoginInput({ ...testCredentials });
    loginHandler(event, testCredentials);
  };
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className='auth-page'>
          <div className='login-page-container-betterme'>
            <form
              className='form-group'
              onSubmit={(event) => loginHandler(event, loginInput)}
            >
              <p className='text-xxl text-centered color-primary'>Login</p>
              <label htmlFor='login_email' className='form-label'>
                Email address
              </label>
              <input
                type='email'
                name='email'
                className='form-control'
                id='login_email'
                placeholder='Enter your email'
                onChange={handleChange}
                value={loginInput.email}
              />
              <label htmlFor='login_password' className='form-label'>
                Password
              </label>
              <input
                type='password'
                name='password'
                className='form-control'
                id='login_password'
                placeholder='Enter your password'
                onChange={handleChange}
                value={loginInput.password}
              />

              <div className='form-options-container mt-4'>
                <div>
                  <input
                    type='checkbox'
                    id='rememberMe'
                    name='rememberMe'
                    value='newsletter'
                  />
                  <label className='ml-1' htmlFor='rememberMe'>
                    Remember Me
                  </label>
                </div>
                <div>
                  <div>Forget Password</div>
                </div>
              </div>
              <button className='btn btn-primary mt-3' type='submit'>
                Login
              </button>
              <button
                className='btn btn-primary-outlined mt-3'
                type='submit'
                onClick={(event) => selectTestCredentials(event)}
              >
                Login With Test Credentials
              </button>
              <div className='mt-3 text-centered'>
                <Link to='/signup' className='sign-up-link'>
                  Don't Have An Account? Create one!
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export { Login };
