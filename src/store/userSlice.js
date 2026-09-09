import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../utils/axiosClient";

const signUpRegister = createAsyncThunk(
  "user-auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = axiosClient.post("/user/signup", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const login = createAsyncThunk(
  "user-auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = axiosClient.post("/user/login", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
const checkAuth = createAsyncThunk(
  "user-auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = axiosClient.get("/user/checkAuth");
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
const logout = createAsyncThunk(
  "user-auth/login",
  async (_, { rejectWithValue }) => {
    try {
      axiosClient.post("/user/logout");
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);



export const userSlice = createSlice({
  name: "user-auth",
  initialState: {
    isAuthenticated: false,
    loading: false,
    error: null,
    userData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Register User Cases
      .addCase(signUpRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(signUpRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // Login User Cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // Check Auth Cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout User Cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});
