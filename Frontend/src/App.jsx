import {Routes, Route } from 'react-router';
import Signup from './pages/signup';
import Verify from './pages/verify'
import Login from './pages/login'
import NotFound from './pages/NotFound';
import StudentDashboard from './pages/studentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import ProtectedRoute from './components/protectedRoute';
import AddApplication from './pages/AddApplication'
import Applications from './pages/Applications';
import EditApplication from './pages/EditApplication';
import Profile from './pages/Profile';
import MentorStudents from './pages/MentorStudents';

function App()
{
  return(
    <div>
        <Routes>
          <Route path='/' element={<Login/>}/>

          <Route path="/signup" element={<Signup/>}/>
          <Route path="/verify" element={<Verify/>}/>
          <Route path="/login" element={<Login/>}/>

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['student','mentor']}>
                <Profile/>
              </ProtectedRoute>
            }/>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }/>

          <Route 
            path='/Mentordashboard' 
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <MentorDashboard />
              </ProtectedRoute>
            }/>

          <Route 
            path='/MentorStudents/:StudentId' 
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <MentorStudents />
              </ProtectedRoute>
            }/>

          <Route 
            path='/applications' 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Applications/>
              </ProtectedRoute>
            }/>

          <Route 
            path='/applications/new' 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <AddApplication />
              </ProtectedRoute>
            }/>

          <Route 
            path='/applications/:id' 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <EditApplication/>
              </ProtectedRoute>
            }/>

          <Route path='/*' element={<NotFound/>}/>
        </Routes>
    </div>
  )
}

export default App;