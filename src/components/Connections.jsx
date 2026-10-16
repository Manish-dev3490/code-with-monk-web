import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Footer from "./footer";
import axiosClient from "../utils/axiosClient";

const Connections = () => {
  const { user } = useSelector((store) => store.user);
  const id = user?.data?._id;

  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchConnections = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get("/request/connections");
        setConnections(response.data.connections);
      } catch (error) {
        setError(
          error.response?.data?.message || "Could not load connections."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col bg-base-300 text-base-content">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
              CodeWithMonk Community
            </p>

            <h1 className="text-3xl font-bold">My Connections</h1>

            <p className="mt-2 text-sm opacity-60">
              Your people. Your progress. Keep growing together.
            </p>
          </div>

          {!loading && !error && (
            <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-400">
              {connections.length}{" "}
              {connections.length === 1 ? "Connection" : "Connections"}
            </span>
          )}
        </div>

        {loading ? (
          <div
            role="status"
            className="flex flex-col items-center justify-center gap-4 py-24"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
            <p className="text-sm opacity-60">
              Finding your coding circle...
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400"
          >
            {error}
          </div>
        ) : connections.length === 0 ? (
          <div className="rounded-3xl border border-base-content/10 bg-base-200 px-6 py-20 text-center">
            <div
              aria-hidden="true"
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-500/10 text-4xl"
            >
              🤝
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Great things start with a connection
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 opacity-60">
              Your circle is waiting to grow. Explore other coders
              and send a request to start connecting.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((connection) => {
              const friend =
                String(connection.fromUserId?._id) === String(id)
                  ? connection.toUserId
                  : connection.fromUserId;

              if (!friend) return null;

              const name =
                [friend.firstName, friend.lastName]
                  .filter(Boolean)
                  .join(" ") || "Coder";

              const solvedCount = friend.problemSolved?.length || 0;

              return (
                <article
                  key={connection._id}
                  className="overflow-hidden rounded-2xl border border-base-content/10 bg-base-200 shadow-sm transition hover:border-indigo-500/40 hover:shadow-lg"
                >
                  <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/15 text-2xl font-bold text-indigo-400">
                        {name.charAt(0).toUpperCase()}
                      </div>

                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
                        Connected
                      </span>
                    </div>

                    <h2 className="mt-5 truncate text-xl font-bold capitalize">
                      {name}
                    </h2>

                    <p className="mt-1 break-all text-sm opacity-60">
                      {friend.emailId || "CodeWithMonk member"}
                    </p>

                    <div className="mt-6 flex items-center justify-between rounded-xl border border-base-content/5 bg-base-300 p-4">
                      <span className="text-sm opacity-60">
                        Problems solved
                      </span>

                      <span className="text-xl font-bold text-indigo-400">
                        {solvedCount}
                      </span>
                    </div>

                    <p className="mt-4 text-xs opacity-50">
                      Connected since{" "}
                      {new Date(connection.updatedAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
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

export default Connections;