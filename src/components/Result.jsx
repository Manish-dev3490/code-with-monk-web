
const Result = ({data}) => {
    const {runError,runLoading,runResult}=data;
   
       return (<div className="space-y-6">

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

        </div>)

  
  
}

export default Result