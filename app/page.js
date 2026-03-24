'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [computerNo, setComputerNo] = useState('');
  const [days, setDays] = useState('');
  const [department, setDepartment] = useState('');

  async function generatePDF() {
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          job,
          computerNo,
          days,
          department,
        }),
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
    <div style={{ padding: 20, maxWidth: 420 }}>
      <h2>Eid Assignment Form</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', marginBottom: 8, padding: 10 }}
      />

      <input
        placeholder="Job"
        value={job}
        onChange={(e) => setJob(e.target.value)}
        style={{ width: '100%', marginBottom: 8, padding: 10 }}
      />

      <input
        placeholder="Computer No"
        value={computerNo}
        onChange={(e) => setComputerNo(e.target.value)}
        style={{ width: '100%', marginBottom: 8, padding: 10 }}
      />

      <input
        placeholder="Days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        style={{ width: '100%', marginBottom: 8, padding: 10 }}
      />

      <input
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        style={{ width: '100%', marginBottom: 12, padding: 10 }}
      />

      <button onClick={generatePDF} style={{ padding: '10px 16px' }}>
        Generate PDF
      </button>
    </div>
  );
}
