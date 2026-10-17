
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";
import Header from "./Header";
import Footer from "./footer";

// Backend language values
const languages = [
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
  { label: "Python", value: "python" },
];

// Zod validation schema
const problemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  description: z.string().trim().min(1, "Description is required"),

  difficultyLevel: z.enum(["easy", "medium", "hard"]),

  tags: z.enum(["array", "linkedList", "graph", "dp"]),

  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().min(1, "Explanation is required"),
    })
  ).min(1, "At least one visible test case required"),

  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
    })
  ).min(1, "At least one hidden test case required"),

  initialCode: z.array(
    z.object({
      language: z.enum(["cpp", "java", "python"]),
      boilerPlate: z.string().min(1, "Boilerplate code is required"),
    })
  ).length(3, "All three languages required"),

  // Matches existing backend spelling
  refrenceSolution: z.array(
    z.object({
      language: z.enum(["cpp", "java", "python"]),
      completeCode: z.string().min(1, "Complete code is required"),
    })
  ).length(3, "All three languages required"),
});

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-error text-sm mt-1">
      {message}
    </p>
  );
};

function CreateProblem() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),

    defaultValues: {
      title: "",
      description: "",
      difficultyLevel: "easy",
      tags: "array",

      visibleTestCases: [
        {
          input: "",
          output: "",
          explanation: "",
        },
      ],

      hiddenTestCases: [
        {
          input: "",
          output: "",
        },
      ],

      initialCode: [
        { language: "cpp", boilerPlate: "" },
        { language: "java", boilerPlate: "" },
        { language: "python", boilerPlate: "" },
      ],

      refrenceSolution: [
        { language: "cpp", completeCode: "" },
        { language: "java", completeCode: "" },
        { language: "python", completeCode: "" },
      ],
    },
  });

  // Visible Test Cases
  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  // Hidden Test Cases
  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  // Validation error handler
  const onInvalid = (validationErrors) => {
    console.error("Validation Failed:", validationErrors);
  };

  // Submit handler
  const onSubmit = async (data) => {
    // Convert single selected tag into an array.
    // Other fields already match the backend schema.
    const payload = {
      ...data,
      tags: [data.tags],
    };

    console.log("Sending API payload:", payload);

    try {
      const response = await axiosClient.post(
        "/problem/create",
        payload
      );

      console.log("Problem created:", response.data);

      alert("Problem created successfully!");

      navigate("/");
    } catch (error) {
      console.error("API ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      alert(`Error: ${message}`);
    }
  };

  return (
    <>
      <Header />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Create New Problem
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-6"
          noValidate
        >
          {/* BASIC INFORMATION */}

          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Title */}

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>

                <input
                  {...register("title")}
                  placeholder="Enter problem title"
                  className="input input-bordered w-full"
                />

                <ErrorMessage message={errors.title?.message} />
              </div>

              {/* Description */}

              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Description
                  </span>
                </label>

                <textarea
                  {...register("description")}
                  placeholder="Enter problem description"
                  className="textarea textarea-bordered h-32 w-full"
                />

                <ErrorMessage
                  message={errors.description?.message}
                />
              </div>

              <div className="flex gap-4">
                {/* Difficulty */}

                <div className="form-control w-1/2">
                  <label className="label">
                    <span className="label-text">
                      Difficulty
                    </span>
                  </label>

                  <select
                    {...register("difficultyLevel")}
                    className="select select-bordered w-full"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  <ErrorMessage
                    message={errors.difficultyLevel?.message}
                  />
                </div>

                {/* Tags */}

                <div className="form-control w-1/2">
                  <label className="label">
                    <span className="label-text">Tag</span>
                  </label>

                  <select
                    {...register("tags")}
                    className="select select-bordered w-full"
                  >
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                  </select>

                  <ErrorMessage message={errors.tags?.message} />
                </div>
              </div>
            </div>
          </div>

          {/* TEST CASES */}

          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Test Cases
            </h2>

            {/* VISIBLE TEST CASES */}

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  Visible Test Cases
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    appendVisible({
                      input: "",
                      output: "",
                      explanation: "",
                    })
                  }
                  className="btn btn-sm btn-primary"
                >
                  Add Visible Case
                </button>
              </div>

              <ErrorMessage
                message={
                  errors.visibleTestCases?.root?.message ||
                  errors.visibleTestCases?.message
                }
              />

              {visibleFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border p-4 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      Visible Case {index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="btn btn-xs btn-error"
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <input
                      {...register(
                        `visibleTestCases.${index}.input`
                      )}
                      placeholder="Input"
                      className="input input-bordered w-full"
                    />

                    <ErrorMessage
                      message={
                        errors.visibleTestCases?.[index]
                          ?.input?.message
                      }
                    />
                  </div>

                  <div>
                    <input
                      {...register(
                        `visibleTestCases.${index}.output`
                      )}
                      placeholder="Output"
                      className="input input-bordered w-full"
                    />

                    <ErrorMessage
                      message={
                        errors.visibleTestCases?.[index]
                          ?.output?.message
                      }
                    />
                  </div>

                  <div>
                    <textarea
                      {...register(
                        `visibleTestCases.${index}.explanation`
                      )}
                      placeholder="Explanation"
                      className="textarea textarea-bordered w-full"
                    />

                    <ErrorMessage
                      message={
                        errors.visibleTestCases?.[index]
                          ?.explanation?.message
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* HIDDEN TEST CASES */}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  Hidden Test Cases
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    appendHidden({
                      input: "",
                      output: "",
                    })
                  }
                  className="btn btn-sm btn-primary"
                >
                  Add Hidden Case
                </button>
              </div>

              <ErrorMessage
                message={
                  errors.hiddenTestCases?.root?.message ||
                  errors.hiddenTestCases?.message
                }
              />

              {hiddenFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border p-4 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      Hidden Case {index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="btn btn-xs btn-error"
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <input
                      {...register(
                        `hiddenTestCases.${index}.input`
                      )}
                      placeholder="Input"
                      className="input input-bordered w-full"
                    />

                    <ErrorMessage
                      message={
                        errors.hiddenTestCases?.[index]
                          ?.input?.message
                      }
                    />
                  </div>

                  <div>
                    <input
                      {...register(
                        `hiddenTestCases.${index}.output`
                      )}
                      placeholder="Output"
                      className="input input-bordered w-full"
                    />

                    <ErrorMessage
                      message={
                        errors.hiddenTestCases?.[index]
                          ?.output?.message
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CODE TEMPLATES */}

          <div className="card bg-base-100 shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Code Templates
            </h2>

            <div className="space-y-6">
              {languages.map((language, index) => (
                <div
                  key={language.value}
                  className="space-y-3 border-b pb-6"
                >
                  <h3 className="font-medium text-lg">
                    {language.label}
                  </h3>

                  {/* Hidden Language Fields */}

                  <input
                    type="hidden"
                    {...register(
                      `initialCode.${index}.language`
                    )}
                  />

                  <input
                    type="hidden"
                    {...register(
                      `refrenceSolution.${index}.language`
                    )}
                  />

                  {/* Boilerplate Code */}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Initial Code
                      </span>
                    </label>

                    <textarea
                      {...register(
                        `initialCode.${index}.boilerPlate`
                      )}
                      className="textarea textarea-bordered w-full font-mono bg-base-300"
                      rows={6}
                      placeholder={`Enter ${language.label} boilerplate code`}
                    />

                    <ErrorMessage
                      message={
                        errors.initialCode?.[index]
                          ?.boilerPlate?.message
                      }
                    />
                  </div>

                  {/* Reference Solution */}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Reference Solution
                      </span>
                    </label>

                    <textarea
                      {...register(
                        `refrenceSolution.${index}.completeCode`
                      )}
                      className="textarea textarea-bordered w-full font-mono bg-base-300"
                      rows={6}
                      placeholder={`Enter ${language.label} complete solution`}
                    />

                    <ErrorMessage
                      message={
                        errors.refrenceSolution?.[index]
                          ?.completeCode?.message
                      }
                    />
                  </div>

                  <ErrorMessage
                    message={
                      errors.initialCode?.[index]
                        ?.language?.message ||
                      errors.refrenceSolution?.[index]
                        ?.language?.message
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* VALIDATION ERRORS */}

          {Object.keys(errors).length > 0 && (
            <div className="alert alert-error" role="alert">
              Please fill all required fields correctly.
              Check the highlighted error messages.
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating Problem...
              </>
            ) : (
              "Create Problem"
            )}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}

export default CreateProblem;
