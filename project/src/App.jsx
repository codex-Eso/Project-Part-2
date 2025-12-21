import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import AddBook from './pages/AddBook'
import AuditLog from './pages/AuditLog'
import Authentication from './pages/Authentication'
import Inventory from './pages/Inventory'
import Notification from './pages/Notification'
import Student from './pages/Student'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import StudentHome from './pages/StudentHome'
import AdminHome from './pages/AdminHome'
import BookInfo from './pages/BookInfo'
import './App.css'
import EditBook from './pages/EditBook'

function App() {
  const [role, getRole] = useState(localStorage.getItem("loginRole"));
  const navigate = useNavigate();
  useEffect(() => {
    const loginRole = localStorage.getItem("loginRole")
    if (loginRole) {
      getRole(loginRole)
    } else {
      navigate("/");
    }
  }, [navigate])
  return (
    <>
      <div className='pt-5 text-center'>
        <Routes id="routes">
          {/*
          Authentication is the default page
          Originally, I said in part 1 there was features that does not require sign in
          But now I decided that it is rather redundant as my users are all TP personals who already have a TP account
          So why would I need guest features when I can save the hassle of my users to just instantly login to access all features
          (Also due to time constraint on my part as well which is why this part has been edited :<)
          */}
          <Route path="/" element={<Authentication />} />
          <Route path="/student" element={<Student />}>
            <Route index element={<StudentHome />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="notification" element={<Notification />} />
            <Route path="book/:id" element={<BookInfo />} />
          </Route>
          <Route path="/admin" element={<Admin />}>
            <Route index element={<AdminHome />} />
            <Route path="logs" element={<AuditLog />} />
            <Route path="addBook" element={<AddBook />} />
            <Route path="book/:id" element={<BookInfo />} />
            <Route path='editBook/:id' element={<EditBook />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
