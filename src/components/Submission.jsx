
const Submission = ({data}) => {
    const {submission,submissionError,submissionLoading,currentSubmission,language}=data;

    return (
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
                                className="bg-base-300 rounded-xl border border-base-300 p-5 space-y-4"
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
    )
}

export default Submission