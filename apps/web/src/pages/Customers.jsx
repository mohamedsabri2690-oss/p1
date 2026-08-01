import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Customers() {
  const [list, setList] = useState([])
  const [name, setName] = useState('')

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    const r = await axios.get('/customers')
    setList(r.data.data)
  }

  async function add(e) {
    e.preventDefault()
    try {
      await axios.post('/customers', { name })
      setName('')
      fetchList()
    } catch (err) {
      alert('Could not add. Are you logged in?')
    }
  }

  return (
    <div>
      <h2>Customers</h2>
      <form onSubmit={add}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul>
        {list.map(c => (
          <li key={c.id}>{c.name} — {c.contact_phone}</li>
        ))}
      </ul>
    </div>
  )
}
