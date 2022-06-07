import axios from 'axios';

const loginUser = async (loginCreds) => {
  const loginBaseUrl = '/api/auth/login';
  try {
    const { data, status } = await axios.post(loginBaseUrl, loginCreds);
    if (status === 200) return data;
    if (status === 500) throw new Error('Login Failed ');
    if (status === 401) throw new Error('Unauthorized access');
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const signupUser = async (signupCred) => {
  const signupBaseUrl = '/api/auth/signup';
  try {
    const { data, status } = await axios.post(signupBaseUrl, signupCred);
    if (status >= 200 && status <= 300) return data;
    if (status === 500) throw new Error('Signup Failed!');
    if (status === 401) throw new Error('Unauthorized access');
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
export { loginUser, signupUser };
