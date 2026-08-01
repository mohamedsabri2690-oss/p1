import React, { useState } from 'react'

export default function App() {
  const [lang, setLang] = useState('ar');

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setLang('ar')}>العربية</button>
        <button onClick={() => setLang('en')} style={{ marginLeft: 8 }}>English</button>
      </div>

      {lang === 'ar' ? (
        <div>
          <h1>نظام إدارة صيانة المكيفات</h1>
          <p>مرحبا — هذه واجهة أولية (ويب).</p>
        </div>
      ) : (
        <div>
          <h1>Aircon Maintenance Management</h1>
          <p>Welcome — this is the web frontend (initial).</p>
        </div>
      )}

    </div>
  )
}
