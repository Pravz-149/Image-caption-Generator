import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState('');
  const [description, setDescription] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageData(URL.createObjectURL(file));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const generateText = async () => {
    if (!imageData) return;

    setLoading(true);

    try {
      const { data } = await axios.post('https://api.ocr.space/parse/image', {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          apikey: 'K88980484188957',
          filetype: 'png',
          base64Image: imageData,
        },
      });

      const responseJson = data;
      if (
        responseJson &&
        responseJson.ParsedResults &&
        responseJson.ParsedResults.length > 0
      ) {
        const extractedText = responseJson.ParsedResults[0].ParsedText;
        setDescription(extractedText);
      } else {
        throw new Error('No text found in OCR response');
      }
    } catch (error) {
      console.error('OCR error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '16px' }} />
      {imageData && <img src={imageData} alt="Uploaded Image" style={{ maxWidth: '400px' }} />}
      <button disabled={loading || !imageData} onClick={generateText} style={{ marginTop: '16px' }}>
        {loading ? 'Generating Text...' : 'Generate Text'}
      </button>
      {description && <p>{description}</p>}
    </div>
  );
}
