import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "./Header";
import Footer from "./footer";
import axiosClient from "../utils/axiosClient";

const RequestReceived = () => {
  const { user } = useSelector((store) => store.user);
  const id = user?.data?._id;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get(
          `/request/received/${id}`
        );

        setRequests(response.data.requests);
      } catch (error) {
        setError(
          error.response?.data?.message || "Could not load requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [id]);

  const handleReview = async (requestId, status) => {
    try {
      setUpdatingId(requestId);
      setActionError("");

      await axiosClient.post(`/request/review/${status}/${requestId}`);

      // Success ke baad reviewed request list se hata do
      setRequests((previousRequests) =>
        previousRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      setActionError(
        error.response?.data?.message ||
          "Could not update the request. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-base-300 text-base-content">
      <Header />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
        <h1 className="text-3xl font-bold">Connection Requests</h1>

        <p className="mt-2 text-sm opacity-60">
          Meet the coders who want to connect with you.
        </p>

        {actionError && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-400"
          >
            {actionError}
          </p>
        )}

        {loading ? (
          <div role="status" className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />

            <p className="mt-4 text-sm opacity-60">
              Loading requests...
            </p>
          </div>
        ) : error ? (
          <p
            role="alert"
            className="mt-8 rounded-xl bg-red-500/10 p-5 text-red-400"
          >
            {error}
          </p>
        ) : requests.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-base-content/10 bg-base-200 px-6 py-16 text-center">
            <span aria-hidden="true" className="text-5xl">
              📬
            </span>

            <h2 className="mt-5 text-2xl font-semibold">
              You’re all caught up!
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 opacity-60">
              No pending requests right now. When another coder
              wants to connect, their request will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {requests.map((request) => {
              const sender = request.fromUserId;
              const name = sender?.firstName || "Coder";

              return (
                <div
                  key={request._id}
                  className="rounded-2xl border border-base-content/10 bg-base-200 p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xl font-bold text-indigo-400">
                        {name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-semibold capitalize">
                          {name}
                        </h2>

                        <p className="mt-1 break-all text-sm opacity-60">
                          {sender?.emailId}
                        </p>

                        <p className="mt-1 text-xs opacity-50">
                          Wants to connect with you
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleReview(request._id, "rejected")
                        }
                        disabled={updatingId !== null}
                        className="flex-1 rounded-xl border border-base-content/15 px-5 py-2.5 text-sm font-semibold transition hover:bg-base-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleReview(request._id, "accepted")
                        }
                        disabled={updatingId !== null}
                        className="flex-1 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Accept
                      </button>
                    </div>
                  </div>

                  {updatingId === request._id && (
                    <p
                      role="status"
                      className="mt-3 text-right text-xs opacity-60"
                    >
                      Updating request...
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RequestReceived;