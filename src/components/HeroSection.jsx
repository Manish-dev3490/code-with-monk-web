import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useSelector } from "react-redux";

const HeroSection = () => {
    const { user } = useSelector((store) => store?.user);

    const [allProblems, setAllProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [displayProblem, setDisplayProblem] = useState([]);

    const [filters, setFilters] = useState({
        status: "all",
        difficulty: "all",
        tag: "all",
    });

    // Fetch all problems
    useEffect(() => {
        const fetchAllProblem = async () => {
            try {
                const response = await axiosClient.get(
                    "/problem/getAllProblem"
                );

                console.log(response.data);

                setAllProblems(response.data.data);
                setDisplayProblem(response.data.data);

            } catch (error) {
                console.error("Error fetching all problems:", error);
            }
        };

        fetchAllProblem();
    }, []);

    // Fetch solved problems
    useEffect(() => {
        const fetchSolvedProblems = async () => {
            try {
                const response = await axiosClient.get(
                    "/problem/problemSolvedByUser"
                );

                console.log(response.data);

                setSolvedProblems(response.data);

            } catch (error) {
                console.error("Error fetching solved problems:", error);
            }
        };

        if (user) {
            fetchSolvedProblems();
        }
    }, [user]);


    // Filter Problems
    const handleFilter = (type, value) => {

        const updatedFilters = {
            ...filters,
            [type]: value,
        };

        setFilters(updatedFilters);

        let problems = allProblems;


        // Status filter
        if (updatedFilters.status === "solved") {

            const solvedIds = new Set(
                solvedProblems.map((problem) => problem._id)
            );

            problems = problems.filter((problem) =>
                solvedIds.has(problem._id)
            );
        }


        // Difficulty filter
        if (updatedFilters.difficulty !== "all") {

            problems = problems.filter(
                (problem) =>
                    problem.difficultyLevel?.toLowerCase() ===
                    updatedFilters.difficulty.toLowerCase()
            );
        }


        // Tag filter
        if (updatedFilters.tag !== "all") {

            problems = problems.filter((problem) =>
                problem.tags?.some(
                    (tag) =>
                        tag.toLowerCase() ===
                        updatedFilters.tag.toLowerCase()
                )
            );
        }


        setDisplayProblem(problems);
    };


    return (
        <div className="flex flex-col gap-6 py-4 px-6">

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">

                {/* Status */}
                <select
                    className="select select-bordered"
                    value={filters.status}
                    onChange={(e) =>
                        handleFilter("status", e.target.value)
                    }
                >
                    <option value="all">All Problems</option>
                    <option value="solved">Solved Problems</option>
                </select>


                {/* Difficulty */}
                <select
                    className="select select-bordered"
                    value={filters.difficulty}
                    onChange={(e) =>
                        handleFilter("difficulty", e.target.value)
                    }
                >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>


                {/* Tag */}
                <select
                    className="select select-bordered"
                    value={filters.tag}
                    onChange={(e) =>
                        handleFilter("tag", e.target.value)
                    }
                >
                    <option value="all">All Tags</option>
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                </select>

            </div>


            {/* Problems */}
            <div className="flex flex-col gap-6 min-h-screen">

                {displayProblem.length > 0 ? (

                    displayProblem.map((problem) => (

                        <div
                            key={problem._id}
                            className="card bg-base-200 border border-base-300 shadow-sm hover:shadow-md transition"
                        >
                            <div className="card-body">

                                <h2 className="card-title">
                                    {problem.title}
                                </h2>

                                <p className="text-sm opacity-70 line-clamp-2">
                                    {problem.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-3">

                                    <span className="badge badge-outline">
                                        {problem.difficultyLevel}
                                    </span>

                                    {problem.tags?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="badge badge-ghost"
                                        >
                                            {tag}
                                        </span>
                                    ))}

                                </div>

                            </div>
                        </div>

                    ))

                ) : (

                    <div className="flex flex-col items-center justify-center flex-1 text-center py-16">

                        <div className="text-5xl mb-4">
                            🔍
                        </div>

                        <h2 className="text-xl font-semibold">
                            No problems found
                        </h2>

                        <p className="text-sm opacity-60 mt-1">
                            Try changing your filters to find some problems.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default HeroSection;
