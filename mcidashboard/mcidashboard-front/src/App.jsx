// routers
import { Routes, Route, useLocation } from 'react-router-dom';
// pages
import Home from './pages/Home';
import Login from './pages/authentication_pages/Login';
import Signup from './pages/authentication_pages/Signup';
import Overview from './pages/OverviewPage';
import SidebarComponent from './components/SidebarComponent'; // Import the SidebarComponent
import DigitalBiomarkersPage from './pages/DigitalBiomarkersPage';
import NavbarComponent from './components/NavbarComponent'; // Import the NavbarComponent

const App = () => {
  const location = useLocation();

  // Paths where the sidebar should not appear
  const hideSidebarPaths = ['/login', '/signup','/patients'];

  // Check if the current path is one of the paths where the sidebar should be hidden
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowSidebar && <NavbarComponent />}
      {shouldShowSidebar && <SidebarComponent />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/overview' element={<Overview/>}></Route>
        <Route path='/digital-biomarkers' element={<DigitalBiomarkersPage/>}></Route>
      </Routes>
    </>
  );
};

export default App;
