// routers
import {Routes, Route} from 'react-router-dom';
//pages
import Home from './pages/Home';
import Login from './pages/authentication_pages/Login';
import Signup from './pages/authentication_pages/Signup';
import PrivateRoute from './PrivateRoute';


const App = () => {
  return (
  <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path='/login' element={<Login/>}/> 
      <Route path='/signup' element={<Signup/>}/>
    </Routes>
  </>
  )
}

export default App;