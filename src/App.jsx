import { Routes, Route, Navigate } from "react-router";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/userSlice"


function App() {

  const { isAuthenticated } = useSelector((store) => store.user);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])

  return (
    <>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/"></Navigate>: <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/"></Navigate> : <Signup />} />
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/signup"></Navigate>} />
      </Routes>
    </>
  )
}

export default App
