import { Link } from "react-router";
import Header from "./Header";
import Footer from "./footer";

function AdminPanel() {
  return (
    <>
      <Header />

      <div className="min-h-[calc(100vh-140px)] bg-base-200 px-5 py-12">

        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-base-content">
              Admin Panel
            </h1>

            <p className="mt-3 text-base-content/60 text-lg">
              Manage and maintain coding problems
            </p>
          </div>


          {/* Operations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Create */}
            <Link
              to="/createproblem"
              className="group"
            >
              <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full">
                <div className="card-body items-center text-center">

                  <div className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center text-3xl font-bold group-hover:bg-success group-hover:text-success-content transition">
                    +
                  </div>

                  <h2 className="card-title mt-3">
                    Create Problem
                  </h2>

                  <p className="text-base-content/60">
                    Add a new coding problem with description, test cases,
                    difficulty and solution.
                  </p>

                  <button className="btn btn-success btn-sm mt-4">
                    Create Problem
                  </button>

                </div>
              </div>
            </Link>


            {/* Update */}
            <Link
              to="/updateproblem"
              className="group"
            >
              <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full">
                <div className="card-body items-center text-center">

                  <div className="w-16 h-16 rounded-2xl bg-info/10 text-info flex items-center justify-center text-2xl font-bold group-hover:bg-info group-hover:text-info-content transition">
                    ✎
                  </div>

                  <h2 className="card-title mt-3">
                    Update Problem
                  </h2>

                  <p className="text-base-content/60">
                    Modify existing problems, test cases, difficulty,
                    tags and other details.
                  </p>

                  <button className="btn btn-info btn-sm mt-4">
                    Update Problem
                  </button>

                </div>
              </div>
            </Link>


            {/* Delete */}
            <Link
              to="/deleteproblem"
              className="group"
            >
              <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full">
                <div className="card-body items-center text-center">

                  <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center text-2xl font-bold group-hover:bg-error group-hover:text-error-content transition">
                    ×
                  </div>

                  <h2 className="card-title mt-3">
                    Delete Problem
                  </h2>

                  <p className="text-base-content/60">
                    Permanently remove an existing coding problem
                    from the platform.
                  </p>

                  <button className="btn btn-error btn-sm mt-4">
                    Delete Problem
                  </button>

                </div>
              </div>
            </Link>

          </div>


          {/* Note */}
          <div className="mt-10">
            <div className="alert bg-base-100 border border-base-300 shadow-sm">
              <div>
                <span className="text-lg">ℹ️</span>

                <div>
                  <h3 className="font-semibold">
                    Admin Note
                  </h3>

                  <p className="text-sm text-base-content/60 mt-1">
                    Please click on the buttons above to perform the
                    required operation.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default AdminPanel;