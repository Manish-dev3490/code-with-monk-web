import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./footer";
import { Link } from "react-router";
import axiosClient from "../utils/axiosClient";

const UpdateProblem = () => {

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

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

        getAllProblems();

    }, []);

    return (
        <>
            <Header />

            <div className="min-h-screen bg-base-200 px-4 py-10">

                <div className="mx-auto max-w-6xl">

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">
                            Update Problem
                        </h1>

                        <p className="mt-2 text-base-content/60">
                            Select a problem that you want to update.
                        </p>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Problems */}
                    {!loading && !error && (
                        <div className="flex flex-col gap-3">

                            {problems.length > 0 ? (

                                problems.map((problem) => (

                                    <div
                                        key={problem._id}
                                        className="card border border-base-300 bg-base-100 shadow-sm transition hover:shadow-lg"
                                    >

                                        <div className="card-body">

                                            <h2 className="card-title">
                                                {problem.title}
                                            </h2>

                                            <p className="line-clamp-3 text-sm text-base-content/60">
                                                {problem.description}
                                            </p>

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

                                            <div className="card-actions mt-5 justify-end">

                                                <Link
                                                    to={`/updateform/${problem._id}`}
                                                    className="btn btn-primary btn-sm rounded-lg"
                                                >
                                                    Update
                                                </Link>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <div className="col-span-full py-20 text-center">
                                    <h3 className="text-xl font-semibold">
                                        No Problems Found
                                    </h3>

                                    <p className="mt-2 text-base-content/60">
                                        There are currently no problems available.
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

export default UpdateProblem;