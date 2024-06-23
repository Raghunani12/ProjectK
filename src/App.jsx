import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import ModelViewer from "./components/ModelViewer";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("Loading your answer...");

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const generatedAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedAnswer);

      // Speak the answer if speech synthesis is supported
      if ('speechSynthesis' in window) {
        speakAnswer(generatedAnswer);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  function speakAnswer(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    setSpeaking(true);

    utterance.onend = () => {
      setSpeaking(false);
    };

    synth.speak(utterance);
  }

  return (
    <div className="bg-white h-screen p-3 flex flex-col items-center">
      <form
        onSubmit={generateAnswer}
        className="w-full md:w-2/3 text-center rounded bg-gray-50 py-2"
      >
        <a href="#" target="_blank">
          <h1 className="text-3xl text-center">Project X</h1>
        </a>
        <textarea
          required
          className="border rounded w-11/12 my-2 min-h-fit p-3"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-300 p-3 rounded-md hover:bg-blue-400 transition-all duration-300"
          disabled={generatingAnswer}
        >
          Generate answer
        </button>
      </form>
      
      <div className="w-full md:w-2/3 flex mt-6">
        <div className="w-1/2 p-3 bg-gray-50 rounded">
          <ReactMarkdown>{answer}</ReactMarkdown>
          {speaking && <p className="mt-2 text-blue-500">Speaking...</p>}
          <button
            className={`mt-4 bg-green-500 text-white p-3 rounded-md hover:bg-green-600 ${
              speaking ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => speakAnswer(answer)}
            disabled={!answer || speaking}
          >
            Speak Answer
          </button>
        </div>

        <div className="w-1/2 p-3 bg-gray-50 rounded flex justify-center">
          <ModelViewer modelUrl="/src/assets/model.glb" />
        </div>
      </div>
    </div>
  );
}

export default App;
