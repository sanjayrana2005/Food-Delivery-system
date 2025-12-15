import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify';
import AdminRoute from './components/Admin'

const App = () => {
  return (
    <div className='app'>
      <ToastContainer position='top-center'/>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path="/add" element={
            <AdminRoute>
            <Add />
            </AdminRoute>
            } />
          <Route path="/list" element={
            <AdminRoute>
            <List />
            </AdminRoute>
             }/>
          <Route path="/orders" element={
            <AdminRoute>
            <Orders />
            </AdminRoute>         
            } />
        </Routes>
      </div>
    </div>
  )
}

export default App