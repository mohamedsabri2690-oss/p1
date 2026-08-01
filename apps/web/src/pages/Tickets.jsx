import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Tickets() {
  const [list, setList] = useState([])

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    const r = await axios.get('/tickets')
    setList(r.data.data)
  }

  return (
    <div>
      <h2>Tickets</h2>
      <ul>
        {list.map(t => (
          <li key={t.id}>{t.title} — {t.customer_name} — {t.device_model || 'No device'}</li>
        ))}
      </ul>
    </div>
  )
}
