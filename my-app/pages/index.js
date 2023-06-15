import React, { useState } from 'react';
import axios from 'axios';
import useLLM from 'usellm';

export default function Home() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [insta, setInsta] = useState('');
  const [showCaptions, setShowCaptions] = useState(false);

  const llm = useLLM({ serviceUrl: 'https://usellm.org/api/llm' });

  async function handleClick(caption) {
    try {
      const { message } = await llm.chat({
        messages: [
          {
            role: 'user',
            content: `
              Generate a few cool Instagram captions using the description:
              
              ${caption}
              
              Suggestions:
              - [Main Suggestion]
              - [Suggestion 1]
              - [Suggestion 2]
              - [Suggestion 3]
              
              Always use hyphens('-') while generating every suggestion 
              Be creative and fun with your captions! and
              Add hashtags: #hashtag1 #hashtag2 #hashtag3
              Add emojies
            `
          }
        ]
      });
      console.log('Received message: ', message.content);
      setInsta(message.content);
      setShowCaptions(true);
    } catch (error) {
      console.error('Something went wrong!', error);
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const imageData = reader.result;
      setImage(imageData);
      setLoading(true);

      try {
        const { data } = await axios.post('./api/replicateCaption', { image: imageData });
        setCaption(data.caption);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ background: '#f5f5f5', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '40px', fontWeight: 'bold', color: '#333', textTransform: 'uppercase' }}>
        Image Caption Generator
      </h1>
      <p style={{ textAlign: 'center', fontSize: '20px', color: '#777' }}>
        Let AI generate captions for your images!
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      {image && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={image} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading caption...</p>
      ) : (
        <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '20px' }}>{caption.slice(8,)}</p>
      )}
      {caption && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => handleClick(caption)}>Generate Image caption</button>
        </div>
      )}
      {showCaptions && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: 'bold' }}>Suggested Captions:</p>
          <ul style={{ paddingLeft: '40px' }}>
            {insta.split('-').map((suggestion, index) => {
              const trimmedSuggestion = suggestion.trim();
              if (trimmedSuggestion && index !== 0) {
                return <li key={index}>{trimmedSuggestion}</li>;
              }
              return null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
