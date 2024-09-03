// routers
import { Routes, Route, useLocation } from 'react-router-dom';
// pages
import Home from './pages/Home';
import Login from './pages/authentication_pages/Login';
import Signup from './pages/authentication_pages/Signup';
import SidebarComponent from './components/SidebarComponent'; // Import the SidebarComponent

const App = () => {
  const location = useLocation();

  // Paths where the sidebar should not appear
  const hideSidebarPaths = ['/login', '/signup'];

  // Check if the current path is one of the paths where the sidebar should be hidden
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className='main-content'>
      {shouldShowSidebar && <SidebarComponent />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
