import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import Header from "./Header";
import Footer from "./footer";
import Description from "./Description";
import Result from "./Result";
import Submission from "./Submission";
import Chatbot from "./Chatbot";

const ProblemPage = () => {
  const { _id } = useParams();

  // Left panel tab state
  const [activeTab, setActiveTab] = useState("description");

  // Problem data states
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Language and editor states
  const [language, setLanguage] = useState("cpp");

  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submission, setSubmission] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);



  const [runLoading, setRunLoading] = useState(false);
  const [runError, setRunError] = useState("");
  const [runResult, setRunResult] = useState(null);

  const starterCode = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code here

    return 0;
}`,
    java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your code here

    }
}`,
    python: `# Write your code here
`,
  };

  const [code, setCode] = useState(starterCode.cpp);

  // Fetch problem using URL parameter
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get(`/problem/${_id}`);
        // console.log(response);

        // Adjust this according to your backend response structure
        setProblem(response.data.data || response.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError(
          err.response?.data?.message ||
          "Unable to fetch problem. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (_id) {
      fetchProblem();
    }
  }, [_id]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axiosClient.get(`/problem/submission/${_id}`);

        setSubmission(response.data.data || []);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    if (_id && activeTab === "submission") {
      fetchSubmissions();
    }
  }, [_id, activeTab, currentSubmission]);

  const handleSubmit = async () => {
    try {
      // Submission tab immediately open
      setActiveTab("submission");

      // Current submission ko loading state me daalo
      setSubmissionLoading(true);
      setSubmissionError("");
      setCurrentSubmission(null);

      const response = await axiosClient.post(`/submission/submit/${_id}`, {
        sourceCode: code,
        language,
      });

      console.log("Submission response:", response);

      const submittedData = response.data.data || response.data;

      // Current submission ka result
      setCurrentSubmission(submittedData);
    } catch (error) {
      console.error("Submission error:", error);

      setSubmissionError(
        error.response?.data?.message ||
        "Unable to submit code. Please try again.",
      );
    } finally {
      setSubmissionLoading(false);
    }
  };


  const handleRun = async () => {
    try {
      // Result tab immediately open
      setActiveTab("result");

      // Previous result/error clear
      setRunLoading(true);
      setRunError("");
      setRunResult(null);

      const response = await axiosClient.post(
        `/submission/run/${_id}`,
        {
          sourceCode: code,
          language,
        }
      );

      // console.log("Run response:", response.data);

      const data = response.data.data || response.data;

      setRunResult(data);

    } catch (error) {
      console.error("Run error:", error);

      setRunError(
        error.response?.data?.message ||
        "Unable to run your code. Please try again."
      );
    } finally {
      setRunLoading(false);
    }
  };
  // Change language and starter code
  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setCode(starterCode[selectedLanguage]);
  };

  // Left panel tabs
  const tabs = [
    { id: "description", label: "Description" },
    { id: "editorial", label: "Editorial" },
    { id: "result", label: "Result" },
    { id: "submission", label: "Submission" },
    { id: "chatbot", label: "ChatBot" },
  ];

  const languages = [
    { id: "cpp", label: "C++" },
    { id: "java", label: "Java" },
    { id: "python", label: "Python" },
  ];

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body items-center text-center">
            <h2 className="text-xl font-bold text-error">
              Something went wrong
            </h2>
            <p className="text-base-content/70">{error}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-base-200 p-3 md:p-5">

        {/* Main split-screen layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-[calc(100vh-40px)]">

          {/* ================= LEFT PANEL ================= */}
          <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm flex flex-col h-[650px] lg:h-full min-h-0 min-w-0 overflow-hidden">

            {/* Tabs */}
            <div className="shrink-0 flex items-center gap-1 p-2 border-b border-base-300 bg-base-100 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn btn-sm md:btn-md rounded-lg whitespace-nowrap ${activeTab === tab.id
                    ? "btn-primary"
                    : "btn-ghost"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ================= TAB CONTENT ================= */}
            <div className="p-5 md:p-7 flex-1 min-h-0 overflow-y-auto">

              {/* ================= DESCRIPTION ================= */}
              {activeTab === "description" && <Description problem={problem} />}

              {/* ================= EDITORIAL ================= */}
              {activeTab === "editorial" && (
                <div className="space-y-4">

                  <h2 className="text-2xl font-bold">
                    Editorial
                  </h2>

                  <div className="alert">
                    <span>
                      Editorial content will be displayed here.
                      We will integrate the editorial feature later.
                    </span>
                  </div>

                </div>
              )}

              {/* ================= RESULT ================= */}
              {activeTab === "result" && <Result data={{ runError, runLoading, runResult }} />}

              {/* ================= SUBMISSION ================= */}
              {activeTab === "submission" && <Submission data={{ submission, submissionError, submissionLoading, currentSubmission, languages, language }} />}

              {activeTab === "chatbot" && (
                <Chatbot key={problem?._id} problem={problem} code={code} />
              )}
            </div>
          </div>


          {/* ================= RIGHT PANEL ================= */}
          <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm flex flex-col h-[650px] lg:h-full min-h-0 min-w-0 overflow-hidden">

            {/* Editor toolbar */}
            <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 p-3 border-b border-base-300">

              <div className="flex items-center gap-2">

                <span className="text-sm font-semibold">
                  Language
                </span>

                <div className="flex gap-1 bg-base-200 p-1 rounded-lg">

                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`btn btn-sm rounded-md ${language === lang.id
                        ? "btn-primary"
                        : "btn-ghost"
                        }`}
                    >
                      {lang.label}
                    </button>
                  ))}

                </div>

              </div>

              <span className="badge badge-outline">
                {languages.find(
                  (lang) => lang.id === language
                )?.label}
              </span>

            </div>


            {/* ================= CODE EDITOR ================= */}
            <div className="flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden bg-[#1e1e1e]">

              <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-white/10">

                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>

                <span className="text-sm text-gray-400 ml-2">
                  solution.
                  {language === "cpp"
                    ? "cpp"
                    : language === "java"
                      ? "java"
                      : "py"}
                </span>

              </div>

              <div className="flex-1 min-h-0 min-w-0">
                <Editor
                  key={language}
                  height="100%"
                  width="100%"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value ?? "")}
                  loading={
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      Loading editor...
                    </div>
                  }
                  options={{
                    automaticLayout: true,
                    fontSize: 14,
                    lineHeight: 24,
                    fontFamily: "Consolas, 'Courier New', monospace",
                    lineNumbers: "on",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    tabSize: 4,
                    insertSpaces: true,
                    autoIndent: "full",
                    autoClosingBrackets: "always",
                    autoClosingQuotes: "always",
                    bracketPairColorization: { enabled: true },
                    padding: { top: 16, bottom: 16 },
                    ariaLabel: "Solution code editor",
                  }}
                />
              </div>

            </div>


            {/* ================= EDITOR FOOTER ================= */}
            <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 p-4 border-t border-base-300 bg-base-100">

              <p className="text-xs text-base-content/50">
                Ready to code
              </p>

              <div className="flex items-center gap-3">

                <button
                  className="btn btn-outline btn-success px-6"
                  onClick={handleRun}
                  disabled={runLoading}
                >
                  <span>▶</span>

                  {runLoading ? "Running..." : "Run"}
                </button>

                <button
                  className="btn btn-primary px-6"
                  onClick={handleSubmit}
                  disabled={submissionLoading}
                >
                  <span>☑</span>

                  {submissionLoading
                    ? "Submitting..."
                    : "Submit"}
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProblemPage;
