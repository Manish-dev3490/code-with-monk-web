import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signUpSchema = z.object({
  firstName: z
    .string()
    .min(3, "Name must contain at least 3 characters")
    .max(30, "Name is too long"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password should contain at least 8 characters"),
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">
            CodeWithMonk
          </h1>

          <p className="text-base-content/60 mt-2">
            Create your account and start coding 🚀
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* First Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                First Name
              </span>
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              {...register("firstName")}
              className={`input input-bordered w-full ${errors.firstName ? "input-error" : ""
                }`}
            />

            {errors.firstName && (
              <p className="text-error text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Email
              </span>
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`input input-bordered w-full ${errors.email ? "input-error" : ""
                }`}
            />

            {errors.email && (
              <p className="text-error text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text font-medium">
                Password
              </span>
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={`input input-bordered w-full ${errors.password ? "input-error" : ""
                }`}
            />

            {errors.password && (
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full text-base"
          >
            Create Account
          </button>

        </form>

        {/* Login */}
        <p className="text-center text-sm text-base-content/60 mt-6">
          Already have an account?{" "}
          <span className="text-primary font-medium cursor-pointer">
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;

