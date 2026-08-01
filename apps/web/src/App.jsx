import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Customers from './pages/Customers'
import Tickets from './pages/Tickets'

axios.defaults.baseURL = 'http://localhost:5000/api'

function Home() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>Choose a section.</p>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const r = await axios.post('/auth/login', { email, password })
      localStorage.setItem('token', r.data.token)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + r.data.token
      navigate('/customers')
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 400 }}>
      <h3>Login</h3>
      <div>
        <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default function App() {
  const [lang, setLang] = useState('ar')

  // set token if exists
  const token = localStorage.getItem('token')
  if (token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

  return (
    <BrowserRouter>
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setLang('ar')}>العربية</button>
          <button onClick={() => setLang('en')} style={{ marginLeft: 8 }}>English</button>
        </div>

        <nav style={{ marginBottom: 16 }}>
          <Link to="/">Home</Link> | <Link to="/customers">Customers</Link> | <Link to="/tickets">Tickets</Link> | <Link to="/login">Login</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customers" element={<Customers lang={lang} />} />
          <Route path="/tickets" element={<Tickets lang={lang} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
