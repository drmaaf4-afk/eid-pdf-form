'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [computerNo, setComputerNo] = useState('');
  const [days, setDays] = useState('');

  async function generatePDF() {
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, job, computerNo, days }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(text);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'eid-form.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error generating PDF');
      console.error(error);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Eid Assignment Form</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} /><br />
      <input placeholder="Job" onChange={(e) => setJob(e.target.value)} /><br />
      <input placeholder="Computer No" onChange={(e) => setComputerNo(e.target.value)} /><br />
      <input placeholder="Days" onChange={(e) => setDays(e.target.value)} /><br />

      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
}
