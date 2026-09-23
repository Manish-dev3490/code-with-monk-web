import { Routes, Route, Navigate } from "react-router";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/userSlice";
import AdminPanel from "./components/AdminPanel";
import CreateProblem from "./components/CreateProblem";
import UpdateProblem from "./components/UpdateProblem";
import DeleteProblem from "./components/DeleteProblem";
import UpdateForm from "./components/UpdateForm";
import ProblemPage from "./components/ProblemPage";
import Profile from "./components/Profile";

function App() {
  const { isAuthenticated, user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/"></Navigate> : <Login />}
        />
        <Route
          path="/problem/:_id"
          element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login"></Navigate>}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/"></Navigate> : <Signup />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/signup"></Navigate>
          }
        />
        <Route
          path="/adminpanel"
          element={
            isAuthenticated && user?.data?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
        <Route
          path="/createproblem"
          element={
            isAuthenticated && user?.data?.role === "admin" ? (
              <CreateProblem />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/updateproblem"
          element={
            isAuthenticated && user?.data?.role === "admin" ? (
              <UpdateProblem />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/deleteproblem"
          element={
            isAuthenticated && user?.data?.role === "admin" ? (
              <DeleteProblem />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/updateform/:problemId"
          element={
            isAuthenticated && user?.data?.role === "admin" ? (
              <UpdateForm />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
         <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
