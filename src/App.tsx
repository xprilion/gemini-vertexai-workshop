import { useState, FormEvent } from "react";
import { geminiApi } from "../config/firebase";

function App() {
  const [basePrompt, setBasePrompt] = useState<string>("");
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [apiOutput, setApiOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreatePrompt = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await geminiApi(
        `Convert this prompt to a more detailed, comprehensive version around 100 words: "${basePrompt}"`
      );
      setEnhancedPrompt(result);
      setUserInput("");
      setApiOutput("");
    } catch (error) {
      console.error("Error enhancing prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOutput = async (e: FormEvent) => {
    e.preventDefault();
    if (!enhancedPrompt) return;

    setIsLoading(true);
    try {
      const result = await geminiApi(
        `Max 100 words output. Prompt: ${enhancedPrompt}\n\nInput: ${userInput}`
      );
      setApiOutput(result);
    } catch (error) {
      console.error("Error generating output:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>Gemini Prompt Enhancer</h1>

      <form
        onSubmit={handleCreatePrompt}
        style={{ width: "100%", marginBottom: "2rem" }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="basePrompt"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Enter Base Prompt:
          </label>
          <textarea
            id="basePrompt"
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minHeight: "100px",
            }}
            placeholder="Enter a simple prompt to enhance..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !basePrompt}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#646cff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Enhancing..." : "Enhance Prompt"}
        </button>
      </form>

      {enhancedPrompt && (
        <div style={{ width: "100%", marginBottom: "2rem" }}>
          <h2>Enhanced Prompt:</h2>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              marginBottom: "1rem",
              color: "black",
            }}
          >
            {enhancedPrompt}
          </div>

          <form onSubmit={handleGenerateOutput} style={{ width: "100%" }}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="userInput"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                Your Input:
              </label>
              <input
                id="userInput"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                placeholder="Enter your specific input..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !userInput}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#646cff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Generating..." : "Generate Output"}
            </button>
          </form>
        </div>
      )}

      {apiOutput && (
        <div style={{ width: "100%" }}>
          <h2>Output:</h2>
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              whiteSpace: "pre-wrap",
              color: "black",
            }}
          >
            {apiOutput}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
