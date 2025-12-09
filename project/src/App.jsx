import { Routes, Route } from 'react-router'

import AddBook from './pages/AddBook'
import AuditLog from './pages/AuditLog'
import Authentication from './pages/Authentication'
import Inventory from './pages/Inventory'
import Notification from './pages/Notification'
import Student from './pages/Student'
import Admin from './pages/Admin'
import MyNavBar from './components/Nav'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <>
      <span id='nav'><MyNavBar /></span>
      <div id='element' className='pt-5 text-center'>
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
            <Route path="inventory" element={<Inventory />} />
            <Route path="notification" element={<Notification />} />
          </Route>
          <Route path="/admin" element={<Admin />}>
            <Route path="logs" element={<AuditLog />} />
            <Route path="addBook" element={<AddBook />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
