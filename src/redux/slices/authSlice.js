import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess(state, action) {
      state.status = 'succeeded';
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    registerStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    registerSuccess(state, action) {
      state.status = 'succeeded';
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    registerFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    },
    continueAsGuest(state) {
      state.isAuthenticated = false;
      state.user = { isGuest: true };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  continueAsGuest,
} = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;