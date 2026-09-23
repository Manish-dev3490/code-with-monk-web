
import  { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import Header from "./Header";
import Footer from "./footer";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosClient.get("/user/profile");
                console.log(response);
                

                // Support both direct user and { user: ... } responses
                const userData = response.data.profile || response.data;

                setProfile(userData);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError(
                    err.response?.data?.message ||
                    "Unable to load your profile. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const formatDate = (date) => {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-base-content/60">
                        Loading your profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center p-5">
                <div className="card bg-base-100 shadow-xl max-w-md w-full">
                    <div className="card-body items-center text-center">
                        <div className="text-4xl">⚠️</div>
                        <h2 className="text-xl font-bold">
                            Profile unavailable
                        </h2>
                        <p className="text-base-content/60">{error}</p>

                        <button
                            className="btn btn-primary mt-3"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const solvedCount = Array.isArray(profile?.problemSolved)
        ? profile.problemSolved.length
        : 0;

    const isAdmin = profile?.role?.toLowerCase() === "admin";

    const initials = (profile?.firstName || "U")
        .trim()
        .charAt(0)
        .toUpperCase();

    return (
        <>

        <Header/>
        <div className="min-h-screen bg-base-200 px-4 py-8 md:px-8">

            <div className="max-w-5xl mx-auto space-y-7">

                {/* Page heading */}
                <div>
                    <p className="text-sm text-primary font-semibold tracking-widest uppercase">
                        CodeWithMonk
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold mt-2">
                        My Profile
                    </h1>

                    <p className="text-base-content/60 mt-2">
                        Manage your account and track your coding journey.
                    </p>
                </div>

                {/* Profile hero card */}
                <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">

                    <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500"></div>

                    <div className="card-body pt-0">

                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">

                            {/* Avatar */}
                            <div className="avatar placeholder">
                                <div className="bg-base-100 text-primary w-24 h-24 rounded-2xl border-4 border-base-100 shadow-md">
                                    <div className="bg-primary/10 w-full h-full flex items-center justify-center rounded-xl">
                                        <span className="text-4xl font-bold">
                                            {initials}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Name and role */}
                            <div className="flex-1 pb-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-2xl md:text-3xl font-bold capitalize">
                                        {profile?.firstName || "User"}
                                    </h2>

                                    <span
                                        className={`badge badge-lg ${
                                            isAdmin
                                                ? "badge-primary"
                                                : "badge-ghost"
                                        }`}
                                    >
                                        {profile?.role || "User"}
                                    </span>
                                </div>

                                <p className="text-base-content/60 mt-1 break-all">
                                    {profile?.emailId || "Email unavailable"}
                                </p>
                            </div>
                        </div>

                        <div className="divider"></div>

                        {/* Coding statistics */}
                        <h3 className="font-semibold text-lg">
                            Coding Statistics
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">

                            <div className="rounded-2xl bg-base-200 p-5 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-success/15 text-success flex items-center justify-center text-2xl">
                                    ✓
                                </div>

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Problems Solved
                                    </p>

                                    <p className="text-3xl font-bold">
                                        {solvedCount}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-base-200 p-5 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-2xl">
                                    &lt;/&gt;
                                </div>

                                <div>
                                    <p className="text-sm text-base-content/60">
                                        Account Role
                                    </p>

                                    <p className="text-2xl font-bold capitalize">
                                        {profile?.role || "User"}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Account information */}
                        <div className="divider"></div>

                        <h3 className="font-semibold text-lg">
                            Account Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

                            <div className="border border-base-300 rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wider text-base-content/50 font-semibold">
                                    First Name
                                </p>

                                <p className="font-medium text-lg capitalize mt-2">
                                    {profile?.firstName || "Not available"}
                                </p>
                            </div>

                            <div className="border border-base-300 rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wider text-base-content/50 font-semibold">
                                    Email Address
                                </p>

                                <p className="font-medium mt-2 break-all">
                                    {profile?.emailId || "Not available"}
                                </p>
                            </div>

                            <div className="border border-base-300 rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wider text-base-content/50 font-semibold">
                                    Member Since
                                </p>

                                <p className="font-medium mt-2">
                                    {formatDate(profile?.createdAt)}
                                </p>
                            </div>

                            <div className="border border-base-300 rounded-xl p-4">
                                <p className="text-xs uppercase tracking-wider text-base-content/50 font-semibold">
                                    Last Updated
                                </p>

                                <p className="font-medium mt-2">
                                    {formatDate(profile?.updatedAt)}
                                </p>
                            </div>

                            <div className="border border-base-300 rounded-xl p-4 md:col-span-2">
                                <p className="text-xs uppercase tracking-wider text-base-content/50 font-semibold">
                                    User ID
                                </p>

                                <p className="font-mono text-sm break-all mt-2">
                                    {profile?._id || "Not available"}
                                </p>
                            </div>

                        </div>

                        {/* Footer note */}
                        <div className="alert bg-primary/5 border border-primary/20 mt-5">
                            <span className="text-sm text-base-content/70">
                                Keep solving problems and building your coding
                                skills. Your progress will be reflected here.
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default Profile;