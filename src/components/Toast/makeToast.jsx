import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const makeToast = (message, theme) => {
  const toastConfig = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    newestOnTop: true,
    draggable: true,
    progress: undefined,
  };
  toast[theme](message, toastConfig);
};

export { makeToast };
