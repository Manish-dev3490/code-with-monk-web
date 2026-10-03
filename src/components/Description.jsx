
const Description = (props) => {

    const { problem } = props;
    // console.log(props);


    return <>


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
    </>


}

export default Description