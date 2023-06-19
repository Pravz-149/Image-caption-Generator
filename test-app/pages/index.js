import { useState } from "react";
import useLLM from "usellm";

function VisualQuestionAnswering() {
  const llm = useLLM({
    serviceUrl: "https://usellm.org/api/llm", // For testing only. Follow this guide to create your own service URL: https://usellm.org/docs/api-reference/create-llm-service
  });

  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [version, setVersion] = useState(
    "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746"
  );
  //const [timeoutValue, setTimeoutValue] = useState("120000");
  const [task, setTask] = useState("visual_question_answering");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClickCall() {
    setResult("");
    setLoading(true);

    const reader = new FileReader();

    reader.onload = async () => {
      const imageData = reader.result;
      try {
        const response = await llm.callReplicate({
          version: version,
          input: {
            image: imageData,
            task: task,
            question: question,
          },
         // timeout: parseInt(timeoutValue),
        });
        setResult(response.output);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setResult("Not Completed! Please increase the value of timeout and try again.");
        setLoading(false);
      }
    };

    if (image) {
      reader.readAsDataURL(image);
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
        Visual Question Answering
      </h1>
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
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-white dark:text-black font-medium"
          onClick={handleClickCall}
          disabled={loading}
        >
          {loading ? "Answering..." : "Ask Question"}
        </button>
      </div>
      {result && (
        <p style={{ textAlign: "center", fontWeight: "bold", marginTop: "20px" }}>
          {result}
        </p>
      )}
    </div>
  );
}

export default VisualQuestionAnswering;