import './App.scss';
import { Navbar } from './components';
import RoutesContainer from './routes/RoutesContainer';
import { ToastContainer } from 'react-toastify';
import { useTheme } from './context';

function App() {
  const { theme } = useTheme();

  return (
    <div className={`App theme-${theme}`}>
      <Navbar />
      <ToastContainer style={{ top: '5rem' }} />
      <RoutesContainer />
    </div>
  );
}

export default App;
