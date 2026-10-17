import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import Header from "./Header";
import Footer from "./footer";
import axiosClient from "../utils/axiosClient";

// Labels are for the UI; values must match the backend/Judge0 payload.
const LANGUAGES = [
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
];

const TAGS = [
  { label: "Array", value: "array" },
  { label: "Linked List", value: "linkedList" },
  { label: "Graph", value: "graph" },
  { label: "DP", value: "dp" },
];

const problemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  difficultyLevel: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.enum(["array", "linkedList", "graph", "dp"]))
    .min(1, "Select at least one tag"),
  visibleTestCases: z.array(z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
    explanation: z.string().min(1, "Explanation is required"),
  })).min(1, "At least one visible test case is required"),
  hiddenTestCases: z.array(z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
  })).min(1, "At least one hidden test case is required"),
  initialCode: z.array(z.object({
    language: z.enum(["cpp", "java", "python"]),
    boilerPlate: z.string().min(1, "Initial code is required"),
  })).length(3, "All three initial codes are required"),
  // Keep this spelling: it's what your working backend expects.
  refrenceSolution: z.array(z.object({
    language: z.enum(["cpp", "java", "python"]),
    completeCode: z.string().min(1, "Reference solution is required"),
  })).length(3, "All three reference solutions are required"),
});

const DEFAULT_VALUES = {
  title: "",
  description: "",
  difficultyLevel: "easy",
  tags: ["array"],
  visibleTestCases: [{ input: "", output: "", explanation: "" }],
  hiddenTestCases: [{ input: "", output: "" }],
  initialCode: LANGUAGES.map(({ value }) => ({
    language: value,
    boilerPlate: "",
  })),
  refrenceSolution: LANGUAGES.map(({ value }) => ({
    language: value,
    completeCode: "",
  })),
};

function ErrorMessage({ message }) {
  return message ? <p className="mt-1 text-sm text-error">{message}</p> : null;
}

function normalizeLanguage(value) {
  const language = String(value ?? "").toLowerCase();
  return language === "c++" ? "cpp" : language;
}

function mapLanguageRows(rows, codeField) {
  const items = Array.isArray(rows) ? rows : [];

  // Match by language, not array index, so different GET orders are safe.
  return LANGUAGES.map(({ value }) => {
    const item = items.find(
      (entry) => normalizeLanguage(entry.language) === value
    );

    return {
      language: value,
      [codeField]:
        item?.[codeField] ??
        (codeField === "boilerPlate" ? item?.initialCode : undefined) ??
        "",
    };
  });
}

function mapProblemToForm(problem) {
  const rawTags = Array.isArray(problem.tags)
    ? problem.tags
    : problem.tags
      ? [problem.tags]
      : [];

  return {
    title: problem.title ?? "",
    description: problem.description ?? "",
    difficultyLevel: problem.difficultyLevel ?? problem.difficulty ?? "easy",
    tags: rawTags,
    visibleTestCases: (problem.visibleTestCases ?? []).map((item) => ({
      input: item.input ?? "",
      output: item.output ?? "",
      explanation: item.explanation ?? "",
    })),
    hiddenTestCases: (problem.hiddenTestCases ?? []).map((item) => ({
      input: item.input ?? "",
      output: item.output ?? "",
    })),
    initialCode: mapLanguageRows(
      problem.initialCode ?? problem.startCode,
      "boilerPlate"
    ),
    refrenceSolution: mapLanguageRows(
      problem.refrenceSolution ?? problem.referenceSolution,
      "completeCode"
    ),
  };
}

function UpdateForm() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: "visibleTestCases" });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: "hiddenTestCases" });

  useEffect(() => {
    let active = true;

    async function fetchProblem() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await axiosClient.get(`/problem/${problemId}`);
        const problem =
          response.data?.data?.problem ??
          response.data?.data ??
          response.data?.problem ??
          response.data;

        if (!problem || typeof problem !== "object" || !problem.title) {
          throw new Error("Problem details are missing from the API response");
        }

        if (active) {
          reset(mapProblemToForm(problem));
          console.log("Loaded problem:", problem);
        }
      } catch (err) {
        console.error("GET problem error:", err);
        if (active) {
          setLoadError(
            err.response?.data?.message ||
              err.message ||
              "Failed to fetch problem details"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProblem();
    return () => { active = false; };
  }, [problemId, reset]);

  const onInvalid = (validationErrors) => {
    console.error("UPDATE FORM VALIDATION FAILED:", validationErrors);
    setSaveError("Please fix the highlighted fields before updating.");
  };

  const onSubmit = async (data) => {
    setSaveError("");

    // Exact field names and lowercase language values from working Postman request.
    // Don't convert real newlines to literal \\n: Judge0 needs multiline code.
    const payload = {
      title: data.title,
      description: data.description,
      difficultyLevel: data.difficultyLevel,
      tags: data.tags,
      visibleTestCases: data.visibleTestCases,
      hiddenTestCases: data.hiddenTestCases,
      initialCode: data.initialCode,
      refrenceSolution: data.refrenceSolution,
    };

    console.log("Updating with payload:", payload);

    try {
      await axiosClient.put(`/problem/update/${problemId}`, payload);
      alert("Problem updated successfully!");
      navigate("/adminpanel");
    } catch (err) {
      console.error("UPDATE API ERROR:", err.response?.data ?? err);
      setSaveError(
        err.response?.data?.message || err.message || "Failed to update problem"
      );
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-base-200">
          <span className="loading loading-spinner loading-lg" />
        </div>
        <Footer />
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <Header />
        <div className="mx-auto max-w-3xl p-8">
          <div className="alert alert-error">{loadError}</div>
          <button className="btn mt-4" onClick={() => navigate("/adminpanel")}>
            Back to Admin Panel
          </button>
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
            <h1 className="text-3xl font-bold sm:text-4xl">Update Problem</h1>
            <p className="mt-2 text-base-content/60">
              Edit the existing problem details below.
            </p>
          </div>

          {saveError && (
            <div role="alert" className="alert alert-error mb-6">
              <span>{saveError}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
            noValidate
          >
            {/* BASIC INFORMATION */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body space-y-4">
                <h2 className="card-title">Basic Information</h2>

                <label className="form-control">
                  <span className="label-text mb-2 font-semibold">Title</span>
                  <input
                    {...register("title")}
                    className="input input-bordered w-full"
                    placeholder="Problem title"
                  />
                  <ErrorMessage message={errors.title?.message} />
                </label>

                <label className="form-control">
                  <span className="label-text mb-2 font-semibold">Description</span>
                  <textarea
                    {...register("description")}
                    className="textarea textarea-bordered min-h-36 w-full"
                    placeholder="Problem description"
                  />
                  <ErrorMessage message={errors.description?.message} />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="form-control">
                    <span className="label-text mb-2 font-semibold">Difficulty</span>
                    <select
                      {...register("difficultyLevel")}
                      className="select select-bordered w-full"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <ErrorMessage message={errors.difficultyLevel?.message} />
                  </label>

                  <div className="form-control">
                    <span className="label-text mb-2 font-semibold">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {TAGS.map((tag) => (
                        <label
                          key={tag.value}
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-base-300 px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            value={tag.value}
                            {...register("tags")}
                            className="checkbox checkbox-primary checkbox-sm"
                          />
                          <span className="text-sm">{tag.label}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMessage message={errors.tags?.message} />
                  </div>
                </div>
              </div>
            </div>

            {/* VISIBLE TEST CASES */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="card-title">Visible Test Cases</h2>
                  <button
                    type="button"
                    onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
                    className="btn btn-primary btn-sm"
                  >
                    + Add Test Case
                  </button>
                </div>
                <ErrorMessage
                  message={errors.visibleTestCases?.message || errors.visibleTestCases?.root?.message}
                />

                {visibleFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 rounded-xl border border-base-300 bg-base-200/40 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Test Case {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeVisible(index)}
                        className="btn btn-error btn-outline btn-xs"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <input
                        {...register(`visibleTestCases.${index}.input`)}
                        placeholder="Input"
                        className="input input-bordered w-full"
                      />
                      <ErrorMessage message={errors.visibleTestCases?.[index]?.input?.message} />
                    </div>
                    <div>
                      <input
                        {...register(`visibleTestCases.${index}.output`)}
                        placeholder="Output"
                        className="input input-bordered w-full"
                      />
                      <ErrorMessage message={errors.visibleTestCases?.[index]?.output?.message} />
                    </div>
                    <div>
                      <textarea
                        {...register(`visibleTestCases.${index}.explanation`)}
                        placeholder="Explanation"
                        className="textarea textarea-bordered min-h-24 w-full"
                      />
                      <ErrorMessage message={errors.visibleTestCases?.[index]?.explanation?.message} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIDDEN TEST CASES */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="card-title">Hidden Test Cases</h2>
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: "", output: "" })}
                    className="btn btn-primary btn-sm"
                  >
                    + Add Hidden Case
                  </button>
                </div>
                <ErrorMessage
                  message={errors.hiddenTestCases?.message || errors.hiddenTestCases?.root?.message}
                />

                {hiddenFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-4 rounded-xl border border-base-300 bg-base-200/40 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Hidden Test Case {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeHidden(index)}
                        className="btn btn-error btn-outline btn-xs"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <input
                        {...register(`hiddenTestCases.${index}.input`)}
                        placeholder="Input"
                        className="input input-bordered w-full"
                      />
                      <ErrorMessage message={errors.hiddenTestCases?.[index]?.input?.message} />
                    </div>
                    <div>
                      <input
                        {...register(`hiddenTestCases.${index}.output`)}
                        placeholder="Output"
                        className="input input-bordered w-full"
                      />
                      <ErrorMessage message={errors.hiddenTestCases?.[index]?.output?.message} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INITIAL CODE + REFERENCE SOLUTIONS */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body space-y-6">
                <h2 className="card-title">Code Templates & Reference Solutions</h2>

                {LANGUAGES.map((language, index) => (
                  <div
                    key={language.value}
                    className="space-y-4 rounded-xl border border-base-300 bg-base-200/40 p-5"
                  >
                    <h3 className="text-lg font-bold">{language.label}</h3>

                    <input
                      type="hidden"
                      {...register(`initialCode.${index}.language`)}
                    />
                    <input
                      type="hidden"
                      {...register(`refrenceSolution.${index}.language`)}
                    />

                    <label className="form-control">
                      <span className="label-text mb-2 font-semibold">Initial Code</span>
                      <textarea
                        {...register(`initialCode.${index}.boilerPlate`)}
                        className="textarea textarea-bordered min-h-48 w-full font-mono text-sm"
                        placeholder={`Enter ${language.label} initial code`}
                        spellCheck={false}
                      />
                      <ErrorMessage message={errors.initialCode?.[index]?.boilerPlate?.message} />
                    </label>

                    <label className="form-control">
                      <span className="label-text mb-2 font-semibold">Reference Solution</span>
                      <textarea
                        {...register(`refrenceSolution.${index}.completeCode`)}
                        className="textarea textarea-bordered min-h-48 w-full font-mono text-sm"
                        placeholder={`Enter ${language.label} reference solution`}
                        spellCheck={false}
                      />
                      <ErrorMessage message={errors.refrenceSolution?.[index]?.completeCode?.message} />
                    </label>
                    <ErrorMessage
                      message={errors.initialCode?.[index]?.language?.message || errors.refrenceSolution?.[index]?.language?.message}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
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
}

export default UpdateForm;
