import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isAuthenticated: false,
  user: {
    username: null,
    id: null,
    role: null,
  },
  loading: false,
};

// Async thunk to check session
export const checkAuthSession = createAsyncThunk(
  'auth/checkAuthSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/user/currentUser`, {
        withCredentials: true,
      });
      // console.log("Response in async thunk:", response)
      return response.data.user; 
    } catch (error) {
      let errorMessage = 'An error occurred while checking the session';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Unauthorized access. Please log in again.';
        } else {
          errorMessage = error.response.data.message || 'Something went wrong.';
        }
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = { id: null, role: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthSession.pending, (state) => {
          state.loading = true;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload
          state.loading = false;
      })
      .addCase(checkAuthSession.rejected, (state) => {
          state.isAuthenticated = false;
          state.user = { id: null, role: null };
          state.loading = false;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
