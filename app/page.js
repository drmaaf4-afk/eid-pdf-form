'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [computerNo, setComputerNo] = useState('');
  const [days, setDays] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  function isEnglishInput(value) {
    return /^[A-Za-z0-9\s\-\/.()]*$/.test(value);
  }

  function handleEnglishOnly(value, setter) {
    if (isEnglishInput(value)) {
      setter(value);
      setError('');
    } else {
      setError('البيانات باللغة الإنجليزية فقط');
    }
  }

  async function generatePDF() {
    if (!name || !job || !computerNo || !days || !department) return;

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
    <div style={{ padding: 20, maxWidth: 420, margin: '0 auto' }}>

      {/* HEADER */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 20,
          backgroundColor: '#2f3f86',
          padding: '15px',
          borderRadius: '14px',
        }}
      >
        <img
          src="/header.png"
          alt="Hospital Logo"
          style={{
            maxWidth: '260px',
            height: 'auto',
            filter: 'brightness(0) invert(1)',
          }}
        />
      </div>

      {/* TITLE */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h2 style={{ marginBottom: 5 }}>Eid Assignment Form</h2>

        <div
          style={{
            direction: 'rtl',
            fontSize: '18px',
            fontWeight: '600',
          }}
        >
          نموذج تكليف عيد الفطر
        </div>

        {/* 🔴 ERROR MESSAGE (only when Arabic entered) */}
        {error && (
          <div
            style={{
              marginTop: 8,
              fontSize: '14px',
              color: '#c0392b',
              fontWeight: '600',
              direction: 'rtl',
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* INPUTS */}
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => handleEnglishOnly(e.target.value, setName)}
        style={{ width: '100%', marginBottom: 8, padding: 10 }}
      />

      <input
        placeholder="Job"
        value={job}
        onChange={(e) => handleEnglishOnly(e.target.value, setJob)}
        style={{ width: '100%', marginBottom: 8, padding: 10 }}
      />

      <input
        placeholder="Computer No"
        value={computerNo}
        onChange={(e) => handleEnglishOnly(e.target.value, setComputerNo)}
        style={{ width: '100%', marginBottom: 8, padding: 10 }}
      />

      <input
        placeholder="Days"
        value={days}
        onChange={(e) => handleEnglishOnly(e.target.value, setDays)}
        style={{ width: '100%', marginBottom: 8, padding: 10 }}
      />

      <input
        placeholder="Department"
        value={department}
        onChange={(e) => handleEnglishOnly(e.target.value, setDepartment)}
        style={{ width: '100%', marginBottom: 12, padding: 10 }}
      />

      <button
        onClick={generatePDF}
        style={{
          padding: '10px 16px',
          width: '100%',
          backgroundColor: '#2f3f86',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
        }}
      >
        Generate PDF
      </button>
    </div>
  );
}
