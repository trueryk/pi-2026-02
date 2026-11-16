import { Routes, Route } from 'react-router-dom'
import './App.css'

// Pages
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'

export default function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cadastrar' element={<Cadastro/>}/>
        <Route path='/entrar' element={<Login/>}/>
      </Routes>
    </>
  )
}
