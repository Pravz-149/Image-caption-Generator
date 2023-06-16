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
      const base64Data = reader.result;
      setImageData(base64Data);
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const generateText = async () => {
    if (!imageData) return;

    setLoading(true);

    try {
      const apiUrl = 'https://api.ocr.space/parse/image';
      const apiKey = 'K88980484188957';
      //const imageUrl = 'http://dl.a9t9.com/ocrbenchmark/eng.png';
      const { data } = await axios.post(apiUrl, {
        language: 'eng',
        isOverlayRequired: 'false',
        filetype: 'png',
        base64Image: imageData,
        iscreatesearchablepdf: 'false',
        issearchablepdfhidetextlayer: 'false'
      }, {
        headers: {
          apikey: apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      console.log(data)

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
