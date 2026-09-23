
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import Header from "./Header";
import Footer from "./footer";
import axiosClient from "../utils/axiosClient";

const UpdateForm = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            difficulty: "easy",
            tags: "array",
            visibleTestCases: [],
            hiddenTestCases: [],
            startCode: [
                { language: "C++", initialCode: "" },
                { language: "Java", initialCode: "" },
                { language: "JavaScript", initialCode: "" },
            ],
            referenceSolution: [
                { language: "C++", completeCode: "" },
                { language: "Java", completeCode: "" },
                { language: "JavaScript", completeCode: "" },
            ],
        },
    });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible,
    } = useFieldArray({
        control,
        name: "visibleTestCases",
    });

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden,
    } = useFieldArray({
        control,
        name: "hiddenTestCases",
    });

    // Get problem details by ID
    useEffect(() => {
        const getProblem = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosClient.get(
                    `/problem/${problemId}`
                );

                const problem = response.data.data;

                reset({
                    title: problem.title,
                    description: problem.description,
                    difficulty: problem.difficulty,
                    tags: problem.tags,
                    visibleTestCases: problem.visibleTestCases || [],
                    hiddenTestCases: problem.hiddenTestCases || [],
                    startCode: problem.startCode,
                    referenceSolution: problem.referenceSolution,
                });

            } catch (err) {
                console.log(err);
                setError(
                    err.response?.data?.message ||
                    "Failed to fetch problem details"
                );
            } finally {
                setLoading(false);
            }
        };

        getProblem();
    }, [problemId, reset]);

    // Update problem
    const onSubmit = async (data) => {
        setSaving(true);
        setError(null);

        try {
            // Change this endpoint if your backend uses a different route.
            await axiosClient.put(
                `/problem/update/${problemId}`,
                data
            );

            alert("Problem updated successfully!");
            navigate("/adminpanel");

        } catch (err) {
            console.log(err);
            setError(
                err.response?.data?.message ||
                "Failed to update problem"
            );
        } finally {
            setSaving(false);
        }
    };

    const languages = ["C++", "Java", "JavaScript"];

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex min-h-screen items-center justify-center bg-base-200">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="min-h-screen bg-base-200 px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">

                    <div className="mb-8">
                        <span className="badge badge-primary badge-outline mb-3">
                            Admin Dashboard
                        </span>

                        <h1 className="text-3xl font-bold sm:text-4xl">
                            Update Problem
                        </h1>

                        <p className="mt-2 text-base-content/60">
                            Edit the existing problem details below.
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-6">
                            <span>{error}</span>
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >

                        {/* Basic Information */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body space-y-4">
                                <h2 className="card-title">
                                    Basic Information
                                </h2>

                                <label className="form-control">
                                    <span className="label-text mb-2 font-semibold">
                                        Title
                                    </span>
                                    <input
                                        {...register("title")}
                                        className="input input-bordered w-full"
                                        placeholder="Problem title"
                                    />
                                </label>

                                <label className="form-control">
                                    <span className="label-text mb-2 font-semibold">
                                        Description
                                    </span>
                                    <textarea
                                        {...register("description")}
                                        className="textarea textarea-bordered min-h-36 w-full"
                                        placeholder="Problem description"
                                    />
                                </label>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label className="form-control">
                                        <span className="label-text mb-2 font-semibold">
                                            Difficulty
                                        </span>
                                        <select
                                            {...register("difficulty")}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2 font-semibold">
                                            Tag
                                        </span>
                                        <select
                                            {...register("tags")}
                                            className="select select-bordered w-full"
                                        >
                                            <option value="array">Array</option>
                                            <option value="linkedList">Linked List</option>
                                            <option value="graph">Graph</option>
                                            <option value="dp">DP</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Visible Test Cases */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body space-y-5">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="card-title">
                                        Visible Test Cases
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            appendVisible({
                                                input: "",
                                                output: "",
                                                explanation: "",
                                            })
                                        }
                                        className="btn btn-primary btn-sm"
                                    >
                                        + Add Test Case
                                    </button>
                                </div>

                                {visibleFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="space-y-4 rounded-xl border border-base-300 bg-base-200/40 p-5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">
                                                Test Case {index + 1}
                                            </h3>

                                            <button
                                                type="button"
                                                onClick={() => removeVisible(index)}
                                                className="btn btn-error btn-outline btn-xs"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <input
                                            {...register(`visibleTestCases.${index}.input`)}
                                            placeholder="Input"
                                            className="input input-bordered w-full"
                                        />

                                        <input
                                            {...register(`visibleTestCases.${index}.output`)}
                                            placeholder="Output"
                                            className="input input-bordered w-full"
                                        />

                                        <textarea
                                            {...register(`visibleTestCases.${index}.explanation`)}
                                            placeholder="Explanation"
                                            className="textarea textarea-bordered min-h-24 w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hidden Test Cases */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body space-y-5">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="card-title">
                                        Hidden Test Cases
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            appendHidden({
                                                input: "",
                                                output: "",
                                            })
                                        }
                                        className="btn btn-primary btn-sm"
                                    >
                                        + Add Hidden Case
                                    </button>
                                </div>

                                {hiddenFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="space-y-4 rounded-xl border border-base-300 bg-base-200/40 p-5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">
                                                Hidden Test Case {index + 1}
                                            </h3>

                                            <button
                                                type="button"
                                                onClick={() => removeHidden(index)}
                                                className="btn btn-error btn-outline btn-xs"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <input
                                            {...register(`hiddenTestCases.${index}.input`)}
                                            placeholder="Input"
                                            className="input input-bordered w-full"
                                        />

                                        <input
                                            {...register(`hiddenTestCases.${index}.output`)}
                                            placeholder="Output"
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Code Templates and Reference Solutions */}
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body space-y-6">
                                <h2 className="card-title">
                                    Code Templates & Reference Solutions
                                </h2>

                                {languages.map((language, index) => (
                                    <div
                                        key={language}
                                        className="space-y-4 rounded-xl border border-base-300 bg-base-200/40 p-5"
                                    >
                                        <h3 className="text-lg font-bold">
                                            {language}
                                        </h3>

                                        <label className="form-control">
                                            <span className="label-text mb-2 font-semibold">
                                                Initial Code
                                            </span>

                                            <textarea
                                                {...register(`startCode.${index}.initialCode`)}
                                                className="textarea textarea-bordered min-h-48 w-full font-mono text-sm"
                                                placeholder={`Enter ${language} initial code`}
                                            />
                                        </label>

                                        <label className="form-control">
                                            <span className="label-text mb-2 font-semibold">
                                                Reference Solution
                                            </span>

                                            <textarea
                                                {...register(`referenceSolution.${index}.completeCode`)}
                                                className="textarea textarea-bordered min-h-48 w-full font-mono text-sm"
                                                placeholder={`Enter ${language} reference solution`}
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary w-full"
                        >
                            {saving ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Updating Problem...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>

                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default UpdateForm;