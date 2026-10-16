import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./footer";
import axiosClient from "../utils/axiosClient";

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sendingId, setSendingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get("/request/feed");
        console.log(response);
        
        setUsers(response.data.users);
      } catch (error) {
        setError(
          error.response?.data?.message || "Could not load your feed."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const handleRequest = async (userId, action) => {
    try {
      setSendingId(userId);
      setActionError("");

      const endpoint =
        action === "interested"
          ? `/request/sent/interested/${userId}`
          : `/request/sent/ignored/${userId}`;

      await axiosClient.post(endpoint);

      // Success hone par user ka card hata do
      setUsers((previousUsers) =>
        previousUsers.filter((user) => user._id !== userId)
      );
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          "Could not complete the action. Please try again."
      );
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-base-300 text-base-content">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
              CodeWithMonk Community
            </p>

            <h1 className="text-3xl font-bold">Discover Coders</h1>

            <p className="mt-2 text-sm opacity-60">
              Find people who share your passion for solving problems.
            </p>
          </div>

          {!loading && !error && users.length > 0 && (
            <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400">
              {users.length} {users.length === 1 ? "Coder" : "Coders"}
            </span>
          )}
        </div>

        {actionError && (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-red-500/10 p-4 text-sm text-red-400"
          >
            {actionError}
          </p>
        )}

        {loading ? (
          <div
            role="status"
            className="flex flex-col items-center justify-center gap-4 py-24"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />

            <p className="text-sm opacity-60">
              Loading your community...
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center"
          >
            <h2 className="text-lg font-semibold text-red-400">
              Couldn’t load the feed
            </h2>

            <p className="mt-2 text-sm opacity-70">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-3xl border border-base-content/10 bg-base-200 px-6 py-20 text-center">
            <div
              aria-hidden="true"
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/10 text-4xl"
            >
              🌱
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              You’re all caught up!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 opacity-60">
              No new coders to discover right now. Check back later
              as the CodeWithMonk community grows.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => {
              const name = user.firstName || "Coder";
              const solvedCount = user.problemSolved?.length || 0;
              const isSending = sendingId === user._id;

              return (
                <article
                  key={user._id}
                  className="overflow-hidden rounded-2xl border border-base-content/10 bg-base-200 shadow-sm transition hover:border-indigo-500/40 hover:shadow-lg"
                >
                  <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl font-bold text-indigo-400">
                        {name.charAt(0).toUpperCase()}
                      </div>

                      <span className="rounded-full border border-base-content/10 px-3 py-1 text-xs opacity-60">
                        Community member
                      </span>
                    </div>

                    <h2 className="mt-5 truncate text-xl font-bold capitalize">
                      {name}
                    </h2>

                    <p className="mt-1 break-all text-sm opacity-60">
                      {user.emailId}
                    </p>

                    <div className="mt-6 flex items-center justify-between rounded-xl border border-base-content/5 bg-base-300 p-4">
                      <span className="text-sm opacity-60">
                        Problems solved
                      </span>

                      <span className="text-xl font-bold text-indigo-400">
                        {solvedCount}
                      </span>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleRequest(user._id, "ignored")}
                        disabled={sendingId !== null}
                        className="flex-1 rounded-xl border border-base-content/15 px-4 py-3 text-sm font-semibold transition hover:bg-base-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Ignore
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleRequest(user._id, "interested")
                        }
                        disabled={sendingId !== null}
                        className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Interested
                      </button>
                    </div>

                    {isSending && (
                      <p role="status" className="mt-3 text-center text-xs opacity-60">
                        Updating...
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Feed;