import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { login } from "../store/userSlice";


const signUpSchema = z.object({

  emailId: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password should contain at least 8 characters"),
});

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const { isAuthenticated } = useSelector((store) => store.user);



  useEffect(() => {

    if (isAuthenticated) {
      navigate('/');
    }

  }, [isAuthenticated])

  const onSubmit = (data) => {
    console.log(data);
    dispatch(login(data))
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">
            CodeWithMonk
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">



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
              {...register("emailId")}
              className={`input input-bordered w-full ${errors.emailId ? "input-error" : ""
                }`}
            />

            {errors.emailId && (
              <p className="text-error text-sm mt-1">
                {errors.emailId.message}
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
          If you don't have an account signup here?{" "}
          <span className="text-primary font-medium cursor-pointer">
            Signup
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;

