import React, { useState } from 'react';
import axios from 'axios';
import useLLM from 'usellm';

function OcrModel() {
  const [loadingText, setLoadingText] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [imageData, setImageData] = useState('');
  const [description, setDescription] = useState('');
  const [summaryAndQuestions, setSummaryAndQuestions] = useState('');
  const llm = useLLM({
    serviceUrl: 'https://usellm.org/api/llm',
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setImageData(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateText = async () => {
    if (!imageData) return;

    setLoadingText(true);

    try {

      // Replace this section with the Google Cloud Vision API call
      // const apiUrl = 'https://api.ocr.space/parse/image';
      // const apiKey = 'K88980484188957';
      // const { data } = await axios.post(apiUrl, {
      //   language: 'eng',
      //   isOverlayRequired: 'false',
      //   filetype: 'png',
      //   base64Image: imageData,
      //   iscreatesearchablepdf: 'false',
      //   issearchablepdfhidetextlayer: 'false',
      // }, {
      //   headers: {
      //     apikey: apiKey,
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      // });

      // const responseJson = data;
      // if (
      //   responseJson &&
      //   responseJson.ParsedResults &&
      //   responseJson.ParsedResults.length > 0
      // ) {
      //   const extractedText = responseJson.ParsedResults[0].ParsedText;
      //   setDescription(extractedText);
      // } else {
      //   throw new Error('No text found in OCR response');
      // }
      
      const apiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyB8k-Lc5ry1h2p5cMQU122r7EKN9_FloO8';
      const apiKey = 'AIzaSyB8k-Lc5ry1h2p5cMQU122r7EKN9_FloO8';

      const request = {
        requests: [
          {
            image: {
              content: imageData.split(',')[1], // Extract base64 image data
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1,
              },
            ],
          },
        ],
      };

      const { data } = await axios.post(apiUrl, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: apiKey,
        },
      });

      const response = data.responses[0];

      if (response && response.textAnnotations && response.textAnnotations.length > 0) {
        const extractedText = response.textAnnotations[0].description;
        setDescription(extractedText);
      } else {
        throw new Error('No text found in OCR response');
      }
    } catch (error) {
      console.error('OCR error:', error);
    } finally {
      setLoadingText(false);
    }
  };

  async function handleClickGenerateSummaryAndQuestions() {
    try {
      setLoadingSummary(true);

      const { message } = await llm.chat({
        messages: [
          {
            role: 'user',
            content: `
              Answer the following question step by step:

              ${description}
            `,
          },
        ],
      });

      console.log('Received message:', message.content);
      setSummaryAndQuestions(message.content);
      setLoadingSummary(false);
    } catch (error) {
      console.error('Something went wrong!', error);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '32px' }}>
      <h1 style={{ textTransform: 'uppercase', marginBottom: '16px' }}>Image2TextQA</h1>
      <h2 style={{ marginBottom: '32px' }}>Decode Images, Answer Questions</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '16px' }} />
      {imageData && <img src={imageData} alt="Uploaded Image" style={{ maxWidth: '400px' }} />}
      <button disabled={loadingText || !imageData} onClick={generateText} style={{ marginTop: '16px' }}>
        {loadingText ? 'Generating Text...' : 'Generate Text'}
      </button>
      {description && (
        <>
          <p>{description}</p>
          <button disabled={loadingSummary} onClick={handleClickGenerateSummaryAndQuestions} style={{ marginTop: '16px' }}>
            {loadingSummary ? 'Generating Summary and Questions...' : 'Generate Summary and Questions'}
          </button>
        </>
      )}
      {summaryAndQuestions && (
        <div>
          <h2>Summary and Questions:</h2>
          <p>{summaryAndQuestions}</p>
        </div>
      )}
    </div>
  );
}

export default OcrModel;
