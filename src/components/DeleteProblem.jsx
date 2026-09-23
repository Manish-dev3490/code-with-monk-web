
import { useEffect, useState } from "react";
import Footer from "./footer";
import Header from "./Header";
import axiosClient from "../utils/axiosClient";

const DeleteProblem = () => {

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Get all problems
    const getAllProblems = async () => {

        setLoading(true);
        setError(null);

        try {
            const response = await axiosClient.get(
                "/problem/getAllProblem"
            );

            setProblems(response.data.data);

        } catch (err) {
            console.log(err);

            setError(
                err.response?.data?.message ||
                "Failed to fetch problems"
            );

        } finally {
            setLoading(false);
        }
    };

    // Initial API call
    useEffect(() => {
        getAllProblems();
    }, []);

    // Delete problem
    const handleDelete = async (problemId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this problem?"
        );

        if (!confirmDelete) return;

        setDeletingId(problemId);
        setError(null);

        try {

            await axiosClient.delete(
                `/problem/delete/${problemId}`
            );

            // Fetch updated problem list after successful deletion
            await getAllProblems();

        } catch (err) {
            console.log(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete problem"
            );

        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Header />

            <div className="min-h-screen bg-base-200 px-4 py-10 sm:px-6 lg:px-8">

                <div className="mx-auto max-w-6xl">

                    {/* Heading */}
                    <div className="mb-8">
                        <span className="badge badge-error badge-outline mb-3">
                            Admin Dashboard
                        </span>

                        <h1 className="text-3xl font-bold text-base-content sm:text-4xl">
                            Delete Problem
                        </h1>

                        <p className="mt-2 text-base-content/60">
                            Select a problem you want to remove from the platform.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-error mb-6">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}

                    {/* Problems List */}
                    {!loading && (
                        <div className="flex flex-col gap-3">

                            {problems.length > 0 ? (

                                problems.map((problem) => (

                                    <div
                                        key={problem._id}
                                        className="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-lg"
                                    >

                                        <div className="card-body">

                                            <h2 className="card-title text-lg">
                                                {problem.title}
                                            </h2>

                                            <p className="line-clamp-3 text-sm text-base-content/60">
                                                {problem.description}
                                            </p>

                                            {/* Difficulty and Tags */}
                                            <div className="mt-3 flex flex-wrap gap-2">

                                                <span className="badge badge-primary">
                                                    {problem.difficultyLevel}
                                                </span>

                                                {problem.tags?.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge badge-outline"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}

                                            </div>

                                            {/* Delete Button */}
                                            <div className="card-actions mt-5 justify-end">

                                                <button
                                                    type="button"
                                                    disabled={deletingId !== null}
                                                    onClick={() => handleDelete(problem._id)}
                                                    className="btn btn-error btn-sm rounded-lg"
                                                >
                                                    {deletingId === problem._id ? (
                                                        <>
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        "Delete Problem"
                                                    )}
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <div className="col-span-full rounded-2xl border border-base-300 bg-base-100 py-16 text-center">

                                    <h3 className="text-xl font-semibold">
                                        No Problems Found
                                    </h3>

                                    <p className="mt-2 text-base-content/60">
                                        There are no problems available to delete.
                                    </p>

                                </div>

                            )}

                        </div>
                    )}

                </div>

            </div>

            <Footer />
        </>
    );
};

export default DeleteProblem;