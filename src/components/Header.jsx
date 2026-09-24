import { Link } from "react-router";
import { Navigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import { useDispatch } from "react-redux";
import { logoutAction } from "../store/userSlice";

const Header = () => {

  const dispatch = useDispatch();


  async function handleLogout() {
    try {
      console.log("api calling")
      await axiosClient.post("/user/logout");
      dispatch(logoutAction());

      console.log("api calling success")

      Navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  }

  return (
    <header className="navbar bg-base-300 shadow-sm px-8">

      {/* Application Name */}
      <div className="flex-1">
        <Link to="/" className="text-2xl font-bold">
          CodeWithMonk
        </Link>
      </div>

      {/* Navbar */}
      <div className="flex-none">
        <ul className="menu menu-horizontal items-center gap-2">

          <li>
            <Link to="/adminpanel">Admin</Link>
          </li>

          <li>
            <Link to="/developers">Developers</Link>
          </li>

          <li>
            <Link to="/connections">Connections</Link>
          </li>

          <li>
            <Link to="/profile">Profile</Link>
          </li>

          {/* User Dropdown */}
          <li>
            <details>
              <summary>Manish</summary>

              <ul className="bg-base-100 rounded-box w-44 p-2 shadow-lg absolute right-4">

                <li>
                  <Link to="/requests">
                    Requests Received
                  </Link>
                </li>

                <li>
                  <Link to="/chatbot">
                    AI Chatbot
                  </Link>
                </li>

                <li>

                  <button onClick={handleLogout} type="button">
                    Logout
                  </button>

                </li>

              </ul>
            </details>
          </li>

        </ul>
      </div>

    </header>
  );
};

export default Header;