import React from 'react';
import Link from 'next/link';

function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Home</h1>
      <h2>Welcome to the Main Landing Page</h2>
      <p>Please select one of the following options:</p>
      <ul>
        <li>
          <Link href="/image-captioning">Image Captioning</Link>
        </li>
        <li>
          <Link href="/visual-question-answering">Visual Question Answering</Link>
        </li>
        <li>
          <Link href="/ocr-model">Image2TextQA</Link>
        </li>
      </ul>
    </div>
  );
}

export default function MainPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Home />
    </div>
  );
}
