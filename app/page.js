'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [computerNo, setComputerNo] = useState('');
  const [days, setDays] = useState('');

  async function generatePDF() {
    const res = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, job, computerNo, days }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Eid Assignment Form</h2>

      <input placeholder="Name" onChange={(e)=>setName(e.target.value)} /><br/>
      <input placeholder="Job" onChange={(e)=>setJob(e.target.value)} /><br/>
      <input placeholder="Computer No" onChange={(e)=>setComputerNo(e.target.value)} /><br/>
      <input placeholder="Days" onChange={(e)=>setDays(e.target.value)} /><br/>

      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
}
