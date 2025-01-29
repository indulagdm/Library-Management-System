import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/librarian/AdminDashboard';
import GetBookDetails from './pages/student/GetBookDetails';
import Purchases from './pages/student/Purchases';
import StudentProfile from './pages/student/StudentProfile';
import AdminOrderBookDetails from './pages/librarian/AdminOrderBookDetails';
import AdminOrderUserDetails from './pages/librarian/AdminOrderUserDetails';
import AdminOrderDetails from './pages/librarian/AdminOrderDetails';

function App() {
  return (
    <div className="App">

      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/student-dashboard' element={<StudentDashboard/>}/>
          <Route path='/get-book-details/:id' element={<GetBookDetails/>}/>
          <Route path='/purchases' element={<Purchases/>}/>
          <Route path='/profile' element={<StudentProfile/>}/>

          <Route path='/teacher-dashboard' element={<TeacherDashboard/>}/>

          <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
          <Route path='/admin-order-user-details' element={<AdminOrderUserDetails/>}/>
          <Route path='/admin-order-book-details' element={<AdminOrderBookDetails/>}/>
          <Route path='/admin-order-details/:id' element={<AdminOrderDetails/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
