import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";

const Chatbot = ({ problem, code }) => {
  // Direct object ya common API response wrappers se problem select karo.
  const problemData = [
    problem,
    problem?.data,
    problem?.problem,
    problem?.data?.problem,
  ].find(
    (item) =>
      typeof item?.title === "string" &&
      typeof item?.description === "string"
  );

  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "Hi! Problem solve karne mein kya help chahiye?",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const chatRef = useRef(null);
  const requestInFlight = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { prompt: "" },
  });

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const onSubmit = async ({ prompt }) => {
    const content = prompt.trim();

    if (!content || requestInFlight.current) return;

    setApiError("");

    if (
      !problemData?.title.trim() ||
      !problemData?.description.trim()
    ) {
      console.log(
        "Chatbot ko mila problem:",
        JSON.stringify(problem, null, 2)
      );

      setApiError(
        "Problem mein title/description nahi mile. Console mein problem ka structure check karo."
      );
      return;
    }

    const previousMessages = messages;
    const updatedMessages = [
      ...previousMessages,
      { role: "user", content },
    ];

    const payload = {
      title: problemData.title,
      description: problemData.description,
      startCode: code ?? problemData.startCode ?? "",
      testCases: problemData.visibleTestCases ?? [],
      messages: updatedMessages,
    };

    requestInFlight.current = true;
    setIsLoading(true);
    setMessages(updatedMessages);
    reset({ prompt: "" });

    try {
      const response = await axiosClient.post("/ai/chat", payload);

      // Backend expected response: { reply: "AI ka answer" }
      const reply = response.data?.reply;

      if (typeof reply !== "string" || !reply.trim()) {
        throw new Error(
          "Backend response mein 'reply' string nahi mili."
        );
      }

      setMessages((previous) => [
        ...previous,
        { role: "model", content: reply },
      ]);
    } catch (error) {
      const serverMessage = error.response?.data?.message;

      setApiError(
        typeof serverMessage === "string"
          ? serverMessage
          : error.message || "Request fail ho gayi. Dobara try karo."
      );

      setMessages(previousMessages);
      reset({ prompt: content });
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
    }
  };

  return (
    <section
      className="flex h-full min-h-0 flex-col gap-4"
      aria-label="Chatbot"
    >
      <h2 className="shrink-0 text-2xl font-bold">Chatbot</h2>

      <div
        ref={chatRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`min-w-0 max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "rounded-br-sm bg-primary text-primary-content"
                  : "rounded-bl-sm bg-base-200 text-base-content"
              }`}
            >
              <p className="mb-1 text-xs font-semibold opacity-70">
                {message.role === "user" ? "You" : "Model"}
              </p>

              <p className="whitespace-pre-wrap text-sm leading-relaxed [overflow-wrap:anywhere]">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start" role="status">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-base-200 px-4 py-3">
              <span
                className="loading loading-dots loading-sm"
                aria-hidden="true"
              />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shrink-0 border-t border-base-300 pt-4"
        noValidate
      >
        <label htmlFor="chatbot-prompt" className="sr-only">
          Your message
        </label>

        <div className="flex items-center gap-2">
          <input
            id="chatbot-prompt"
            type="text"
            placeholder="Apna message likho..."
            autoComplete="off"
            disabled={isLoading}
            className="input input-bordered min-w-0 flex-1"
            aria-invalid={Boolean(errors.prompt)}
            aria-describedby={
              errors.prompt ? "chatbot-prompt-error" : undefined
            }
            {...register("prompt", {
              validate: (value) =>
                value.trim().length > 0 ||
                "Please enter a message.",
            })}
          />

          <button
            type="submit"
            className="btn btn-primary shrink-0"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>

        {errors.prompt && (
          <p
            id="chatbot-prompt-error"
            role="alert"
            className="mt-2 text-sm text-error"
          >
            {errors.prompt.message}
          </p>
        )}

        {apiError && (
          <p role="alert" className="mt-2 text-sm text-error">
            {apiError}
          </p>
        )}
      </form>
    </section>
  );
};

export default Chatbot;