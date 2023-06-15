import { useState } from "react";
import useLLM from "usellm";

export default function DemoReplicateModel() {
  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [version, setVersion] = useState(
    "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746"
  );
  const [timeoutValue, setTimeoutValue] = useState("10000");
  const [loading, setLoading] = useState(false);
  const [insta, setInsta] = useState('');
  const [showCaptions, setShowCaptions] = useState(false);

  async function handleClickCall() {
    setResult("");
    setLoading(true);

    const reader = new FileReader();

    reader.onload = async () => {
      const imageData = reader.result;
      const response = await llm.callReplicate({
        version: version,
        input: { image: imageData },
        timeout: parseInt(timeoutValue),
      });
      console.log(response);
      setResult(response.output);
      setLoading(false);
    };

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    setImage(file);
  }

  async function handleClick(result) {
    try {
      const { message } = await llm.chat({
        messages: [
          {
            role: 'user',
            content: `
              Generate a few cool Instagram captions using the description:
              
              ${result}
              
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

  return (
    <div style={{ background: "#f5f5f5", padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "40px",
          fontWeight: "bold",
          color: "#333",
          textTransform: "uppercase",
        }}
      >
        Image Caption Generator
      </h1>
      <p
        style={{
          textAlign: "center",
          fontSize: "20px",
          color: "#777",
        }}
      >
        Let AI generate captions for your images!
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      {image && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium"
          onClick={handleClickCall}
          disabled={loading}
        >
          {loading ? "Generating Description..." : "Generate Description"}
        </button>
      </div>
      {result && (
        <p style={{ textAlign: "center", fontWeight: "bold", marginTop: "20px" }}>
          {result.slice(8,)}
        </p>
      )}
    {result && (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => handleClick(result)}>Generate Image captions</button>
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
    </div>)
}

