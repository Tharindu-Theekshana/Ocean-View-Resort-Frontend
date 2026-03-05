import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Rooms from './pages/Rooms'
import Login from './pages/Login'
import Reservations from './pages/Reservations'
import Dashboard from './pages/Dashboard'
import CreateReservation from './pages/CreateReservation'
import ViewReservations from './pages/ViewReservations'
import CreateUsers from './pages/CreateUsers'
import AddRoom from './pages/AddRoom'
import Help from './pages/Help'

function App() {

  return (
    <>
    <Router>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='*' element={<NotFound/>}/>
          <Route path='/rooms' element={<Rooms/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/reservations' element={<Reservations/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/create-reservation' element={<CreateReservation/>}/>
          <Route path='/view-reservations' element={<ViewReservations/>}/>
          <Route path='/create-user' element={<CreateUsers/>}/>
          <Route path='/add-room' element={<AddRoom/>}/>
          <Route path='/help' element={<Help/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
