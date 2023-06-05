import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import Header from './components/Header'
import Home from './components/Home'
import Auth from './components/Auth'
import Form from './components/Form'
import Profile from './components/Profile'

const App = () => {
  return (
    <div className='app'>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<Auth/>}/>
        <Route path='/form' element={<Form/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
    </div>
  )
}

export default App
