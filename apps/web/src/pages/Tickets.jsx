import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Tickets() {
  const [list, setList] = useState([])
  const [attachments, setAttachments] = useState({})
  const [fileMap, setFileMap] = useState({})

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    const r = await axios.get('/tickets')
    setList(r.data.data)

    // fetch attachments for each ticket
    const attachMap = {}
    await Promise.all(r.data.data.map(async (t) => {
      try {
        const ar = await axios.get(`/tickets/${t.id}/attachments`)
        attachMap[t.id] = ar.data.data || []
      } catch (err) {
        attachMap[t.id] = []
      }
    }))
    setAttachments(attachMap)
  }

  function handleFileChange(ticketId, file) {
    setFileMap(prev => ({ ...prev, [ticketId]: file }))
  }

  async function uploadFile(e, ticketId) {
    e.preventDefault()
    const file = fileMap[ticketId]
    if (!file) return alert('Select a file first')
    const fd = new FormData()
    fd.append('file', file)
    try {
      await axios.post(`/tickets/${ticketId}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert('Uploaded')
      // refresh attachments
      const ar = await axios.get(`/tickets/${ticketId}/attachments`)
      setAttachments(prev => ({ ...prev, [ticketId]: ar.data.data || [] }))
      setFileMap(prev => ({ ...prev, [ticketId]: null }))
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    }
  }

  return (
    <div>
      <h2>Tickets</h2>
      <ul>
        {list.map(t => (
          <li key={t.id} style={{ marginBottom: 12 }}>
            <div><strong>{t.title}</strong> — {t.customer_name} — {t.device_model || 'No device'}</div>

            <div style={{ marginTop: 8 }}>
              <form onSubmit={(e) => uploadFile(e, t.id)}>
                <input type="file" onChange={e => handleFileChange(t.id, e.target.files[0])} />
                <button type="submit">Upload attachment</button>
              </form>

              <div style={{ marginTop: 8 }}>
                <strong>Attachments:</strong>
                <ul>
                  {(attachments[t.id] || []).map(a => (
                    <li key={a.id}><a href={axios.defaults.baseURL.replace('/api','') + a.file_path} target="_blank" rel="noreferrer">{a.file_path}</a></li>
                  ))}
                </ul>
              </div>
            </div>

          </li>
        ))}
      </ul>
    </div>
  )
}
