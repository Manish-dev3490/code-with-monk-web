import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import Header from "./Header";
import Footer from "./footer";

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
        console.log(response);

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

      console.log("Run response:", response.data);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-40px)]">

          {/* ================= LEFT PANEL ================= */}
          <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm flex flex-col h-full min-h-0 overflow-hidden">

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
              {activeTab === "description" && (
                <div className="space-y-5">

                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {problem?.title || "Problem"}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 mt-4">

                      <span
                        className={`badge badge-lg ${problem?.difficultyLevel?.toLowerCase() === "easy"
                          ? "badge-success"
                          : problem?.difficultyLevel?.toLowerCase() === "medium"
                            ? "badge-warning"
                            : "badge-error"
                          }`}
                      >
                        {problem?.difficultyLevel || "Difficulty"}
                      </span>

                      {problem?.tags &&
                        (Array.isArray(problem.tags)
                          ? problem.tags
                          : [problem.tags]
                        ).map((tag, index) => (
                          <span
                            key={index}
                            className="badge badge-outline badge-lg"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  <div>
                    <h2 className="text-lg font-semibold mb-3">
                      Problem Description
                    </h2>

                    <div className="text-base-content/80 leading-7 whitespace-pre-wrap">
                      {problem?.description ||
                        "Problem description will appear here."}
                    </div>
                  </div>

                  {/* Visible test cases */}
                  {problem?.visibleTestCases?.length > 0 && (
                    <div className="space-y-4">

                      <h2 className="text-lg font-semibold">
                        Examples
                      </h2>

                      {problem.visibleTestCases.map((testCase, index) => (
                        <div
                          key={index}
                          className="bg-base-200 rounded-xl p-4 space-y-3"
                        >

                          <h3 className="font-semibold">
                            Example {index + 1}
                          </h3>

                          <div>
                            <p className="text-sm font-semibold mb-1">
                              Input
                            </p>

                            <pre className="bg-base-300 p-3 rounded-lg whitespace-pre-wrap break-words text-sm">
                              {testCase.input}
                            </pre>
                          </div>

                          <div>
                            <p className="text-sm font-semibold mb-1">
                              Output
                            </p>

                            <pre className="bg-base-300 p-3 rounded-lg whitespace-pre-wrap break-words text-sm">
                              {testCase.output}
                            </pre>
                          </div>

                          {testCase.explanation && (
                            <div>
                              <p className="text-sm font-semibold mb-1">
                                Explanation
                              </p>

                              <p className="text-sm text-base-content/70">
                                {testCase.explanation}
                              </p>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

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
              {activeTab === "result" && (
                <div className="space-y-6">

                  <h2 className="text-2xl font-bold">
                    Execution Result
                  </h2>

                  {/* ================= LOADING ================= */}
                  {runLoading && (
                    <div className="bg-base-200 rounded-xl border border-base-300 p-8">
                      <div className="flex flex-col items-center justify-center gap-3">

                        <span className="loading loading-spinner loading-lg text-primary"></span>

                        <p className="font-medium">
                          Running your code...
                        </p>

                        <p className="text-sm text-base-content/60">
                          Please wait while your code is being executed.
                        </p>

                      </div>
                    </div>
                  )}

                  {/* ================= ERROR ================= */}
                  {!runLoading && runError && (
                    <div className="alert alert-error">
                      <div>
                        <h3 className="font-bold">
                          Execution Failed
                        </h3>

                        <p className="text-sm mt-1">
                          {runError}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ================= RESULT ================= */}
                  {!runLoading && !runError && runResult && (
                    <div className="space-y-5">

                      {/* Message */}
                      {runResult.message && (
                        <div className="alert alert-success">
                          <span>
                            {runResult.message}
                          </span>
                        </div>
                      )}

                      {/* Test Case Results */}
                      {runResult.results?.map((result, index) => (
                        <div
                          key={result.token || index}
                          className="bg-base-200 rounded-xl border border-base-300 p-5 space-y-4"
                        >

                          {/* Test Case Header */}
                          <div className="flex items-center justify-between">

                            <h3 className="font-semibold text-lg">
                              Test Case {index + 1}
                            </h3>

                            <span
                              className={`badge badge-lg ${result.status?.id === 3
                                ? "badge-success"
                                : "badge-error"
                                }`}
                            >
                              {result.status?.description || "Unknown"}
                            </span>

                          </div>

                          {/* Input + Expected + Output */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                            {/* Input */}
                            <div className="bg-base-100 rounded-lg p-4">

                              <p className="text-sm text-base-content/60 mb-2">
                                Input
                              </p>

                              <pre className="text-sm whitespace-pre-wrap break-words">
                                {result.stdin || "No input"}
                              </pre>

                            </div>

                            {/* Expected Output */}
                            <div className="bg-base-100 rounded-lg p-4">

                              <p className="text-sm text-base-content/60 mb-2">
                                Expected Output
                              </p>

                              <pre className="text-sm whitespace-pre-wrap break-words">
                                {result.expected_output || "No expected output"}
                              </pre>

                            </div>

                            {/* Your Output */}
                            <div className="bg-base-100 rounded-lg p-4">

                              <p className="text-sm text-base-content/60 mb-2">
                                Your Output
                              </p>

                              <pre className="text-sm whitespace-pre-wrap break-words">
                                {result.stdout || "No output"}
                              </pre>

                            </div>

                          </div>

                          {/* Runtime + Memory */}
                          <div className="grid grid-cols-2 gap-3">

                            <div className="bg-base-100 rounded-lg p-4">

                              <p className="text-sm text-base-content/60">
                                Runtime
                              </p>

                              <p className="font-semibold mt-1">
                                {result.time ?? 0} sec
                              </p>

                            </div>

                            <div className="bg-base-100 rounded-lg p-4">

                              <p className="text-sm text-base-content/60">
                                Memory
                              </p>

                              <p className="font-semibold mt-1">
                                {result.memory ?? 0} KB
                              </p>

                            </div>

                          </div>

                          {/* Error / Stderr */}
                          {(result.stderr || result.compile_output || result.message) && (
                            <div className="bg-base-100 rounded-lg p-4">

                              <p className="text-sm font-semibold text-error">
                                Error
                              </p>

                              <pre className="text-sm mt-2 whitespace-pre-wrap break-words text-error">
                                {result.stderr ||
                                  result.compile_output ||
                                  result.message}
                              </pre>

                            </div>
                          )}

                        </div>
                      ))}

                    </div>
                  )}

                  {/* ================= NO RESULT ================= */}
                  {!runLoading &&
                    !runError &&
                    !runResult && (
                      <div className="bg-base-200 rounded-xl p-8 text-center">

                        <h3 className="text-lg font-semibold">
                          No result yet
                        </h3>

                        <p className="text-base-content/60 mt-2">
                          Click the Run button to execute your code.
                        </p>

                      </div>
                    )}

                </div>
              )}

              {/* ================= SUBMISSION ================= */}
              {activeTab === "submission" && (
                <div className="space-y-6">

                  <h2 className="text-2xl font-bold">
                    Submission
                  </h2>

                  {/* ================= CURRENT SUBMISSION ================= */}
                  <div>

                    <h3 className="text-lg font-semibold mb-3">
                      Current Submission
                    </h3>

                    {/* Loading */}
                    {submissionLoading && (
                      <div className="bg-base-200 rounded-xl border border-base-300 p-8">

                        <div className="flex flex-col items-center justify-center gap-3">

                          <span className="loading loading-spinner loading-lg text-primary"></span>

                          <p className="font-medium">
                            Submitting your code...
                          </p>

                          <p className="text-sm text-base-content/60">
                            Please wait while your code is being evaluated.
                          </p>

                        </div>

                      </div>
                    )}

                    {/* Submission Error */}
                    {!submissionLoading && submissionError && (
                      <div className="alert alert-error">

                        <div>

                          <h3 className="font-bold">
                            Submission Failed
                          </h3>

                          <p className="text-sm mt-1">
                            {submissionError}
                          </p>

                        </div>

                      </div>
                    )}

                    {/* Current Submission Result */}
                    {!submissionLoading &&
                      !submissionError &&
                      currentSubmission && (

                        <div className="bg-base-200 rounded-xl border border-base-300 p-5 space-y-4">

                          {/* Status + Language */}
                          <div className="flex flex-wrap items-center justify-between gap-3">

                            <span
                              className={`badge badge-lg ${currentSubmission.status?.toLowerCase() ===
                                "accepted"
                                ? "badge-success"
                                : currentSubmission.status?.toLowerCase() ===
                                  "wrong"
                                  ? "badge-error"
                                  : "badge-warning"
                                }`}
                            >
                              {currentSubmission.status || "Submitted"}
                            </span>

                            <span className="badge badge-outline badge-lg">
                              {currentSubmission.language?.toUpperCase() ||
                                language.toUpperCase()}
                            </span>

                          </div>

                          {/* Runtime + Memory */}
                          <div className="grid grid-cols-2 gap-3">

                            <div className="bg-base-100 rounded-lg p-3">
                              <p className="text-sm text-base-content/60">
                                Runtime
                              </p>

                              <p className="font-semibold mt-1">
                                {currentSubmission.runtime ?? 0} sec
                              </p>
                            </div>

                            <div className="bg-base-100 rounded-lg p-3">
                              <p className="text-sm text-base-content/60">
                                Memory
                              </p>

                              <p className="font-semibold mt-1">
                                {currentSubmission.memory ?? 0} KB
                              </p>
                            </div>

                          </div>

                          {/* Test Cases */}
                          <div className="bg-base-100 rounded-lg p-3">

                            <p className="text-sm text-base-content/60">
                              Test Cases Passed
                            </p>

                            <p className="font-semibold mt-1">
                              {currentSubmission.testCasesPassed ?? 0}
                              {" / "}
                              {currentSubmission.testCasesTotal ?? 0}
                            </p>

                          </div>

                          {/* Error Message */}
                          {currentSubmission.errorMessage && (
                            <div className="bg-base-100 rounded-lg p-3">

                              <p className="text-sm font-semibold text-error">
                                Error Message
                              </p>

                              <p className="text-sm mt-1 break-words">
                                {currentSubmission.errorMessage}
                              </p>

                            </div>
                          )}

                          {/* Submitted Code */}
                          {currentSubmission.code && (
                            <details className="collapse collapse-arrow bg-base-100 rounded-lg">

                              <summary className="collapse-title font-medium">
                                View Submitted Code
                              </summary>

                              <div className="collapse-content">

                                <pre className="bg-[#0d1117] text-green-300 rounded-lg p-4 overflow-x-auto text-sm whitespace-pre-wrap">
                                  <code>
                                    {currentSubmission.code}
                                  </code>
                                </pre>

                              </div>

                            </details>
                          )}

                        </div>
                      )}

                  </div>


                  {/* ================= SUBMISSION HISTORY ================= */}
                  <div className="divider"></div>

                  <div>

                    <h3 className="text-lg font-semibold mb-3">
                      Submission History
                    </h3>

                    {/* Empty */}
                    {!submission || submission.length === 0 ? (

                      <div className="bg-base-200 rounded-xl p-8 text-center">

                        <h3 className="text-lg font-semibold">
                          No previous submissions
                        </h3>

                        <p className="text-base-content/60 mt-2">
                          Your submission history will appear here.
                        </p>

                      </div>

                    ) : (

                      /* History */
                      <div className="flex flex-col gap-4">

                        {submission.map((item) => (

                          <div
                            key={item._id}
                            className="bg-base-200 rounded-xl border border-base-300 p-5 space-y-4"
                          >

                            {/* Status + Language */}
                            <div className="flex flex-wrap items-center justify-between gap-3">

                              <span
                                className={`badge badge-lg ${item.status?.toLowerCase() === "accepted"
                                  ? "badge-success"
                                  : item.status?.toLowerCase() === "wrong"
                                    ? "badge-error"
                                    : "badge-warning"
                                  }`}
                              >
                                {item.status}
                              </span>

                              <span className="badge badge-outline badge-lg">
                                {item.language?.toUpperCase()}
                              </span>

                            </div>

                            {/* Runtime + Memory */}
                            <div className="grid grid-cols-2 gap-3">

                              <div className="bg-base-100 rounded-lg p-3">

                                <p className="text-sm text-base-content/60">
                                  Runtime
                                </p>

                                <p className="font-semibold mt-1">
                                  {item.runtime ?? 0} sec
                                </p>

                              </div>

                              <div className="bg-base-100 rounded-lg p-3">

                                <p className="text-sm text-base-content/60">
                                  Memory
                                </p>

                                <p className="font-semibold mt-1">
                                  {item.memory ?? 0} KB
                                </p>

                              </div>

                            </div>

                            {/* Test Cases */}
                            <div>

                              <p className="text-sm text-base-content/60">
                                Test Cases Passed
                              </p>

                              <p className="font-semibold mt-1">
                                {item.testCasesPassed ?? 0}
                                {" / "}
                                {item.testCasesTotal ?? 0}
                              </p>

                            </div>

                            {/* Error */}
                            {item.errorMessage && (
                              <div className="bg-base-100 rounded-lg p-3">

                                <p className="text-sm font-semibold text-error">
                                  Error Message
                                </p>

                                <p className="text-sm mt-1 break-words">
                                  {item.errorMessage}
                                </p>

                              </div>
                            )}

                            {/* Date */}
                            <div className="text-sm text-base-content/60">

                              Submitted on:{" "}
                              {item.createdAt
                                ? new Date(
                                  item.createdAt
                                ).toLocaleString()
                                : "Date unavailable"}

                            </div>

                            {/* Code */}
                            <details className="collapse collapse-arrow bg-base-100 rounded-lg">

                              <summary className="collapse-title font-medium">
                                View Submitted Code
                              </summary>

                              <div className="collapse-content">

                                <pre className="bg-[#0d1117] text-green-300 rounded-lg p-4 overflow-x-auto text-sm whitespace-pre-wrap">
                                  <code>
                                    {item.code}
                                  </code>
                                </pre>

                              </div>

                            </details>

                          </div>

                        ))}

                      </div>

                    )}

                  </div>

                </div>
              )}

            </div>
          </div>


          {/* ================= RIGHT PANEL ================= */}
          <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm flex flex-col h-full min-h-0 overflow-hidden">

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
            <div className="flex-1 min-h-0 bg-[#0d1117]">

              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">

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

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[400px] resize-none bg-transparent text-green-300 font-mono text-sm leading-6 p-5 outline-none border-none focus:outline-none"
                placeholder="Write your code here..."
              />

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
