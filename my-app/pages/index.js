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
  const [insta, setInsta] = useState("");
  const [showCaptions, setShowCaptions] = useState(false);
  const [loadingCaptions, setLoadingCaptions] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState("");

  async function handleClickCall() {
    setResult("");
    setLoading(true);
    setShowCaptions(false);

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

  async function handleClickGenerateCaptions() {
    try {
      setLoadingCaptions(true);

      const { message } = await llm.chat({
        messages: [
          {
            role: "user",
            content: `
            Generate a few cool Instagram captions using the description:
              
            ${result},${userSuggestions}
            
            Suggestions:
            - [Main Suggestion]
            - [Suggestion 1]
            - [Suggestion 2]
            - [Suggestion 3]
            
            Always use hyphens('-') while generating every suggestion 
            Be creative and fun with your captions! and
            Add hashtags: #hashtag1 #hashtag2 #hashtag3
            Add emojis
            `,
          },
        ],
      });

      console.log("Received message: ", message.content);
      setInsta(message.content);
      setShowCaptions(true);
      setLoadingCaptions(false);
    } catch (error) {
      console.error("Something went wrong!", error);
    }
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    setImage(file);
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
        <>
          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            {result.slice(8)}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <textarea
              rows="4"
              cols="50"
              placeholder="Enter your suggestions..."
              value={userSuggestions}
              onChange={(e) => setUserSuggestions(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button
              onClick={handleClickGenerateCaptions}
              disabled={loading || loadingCaptions}
            >
              {loadingCaptions ? "Generating Captions..." : "Generate Image Captions"}
            </button>
          </div>
        </>
      )}
      {showCaptions && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontWeight: "bold" }}>Suggested Captions:</p>
          <ul style={{ paddingLeft: "40px" }}>
            {insta
              .split("-")
              .map((suggestion, index) => {
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
