import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authInitializationComplete(state) {
      state.isInitializing = false;
    },
    loginStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess(state, action) {
      state.status = 'succeeded';
      state.isAuthenticated = true;
      state.isInitializing = false;
      state.user = { ...action.payload, isGuest: false };
    },
    loginFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    registerStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    registerFailure(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.status = 'idle';
    },
    continueAsGuest(state) {
      state.isAuthenticated = false;
      state.isInitializing = false;
      state.user = { isGuest: true };
    },
    updateProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateCommunicationPrefs(state, action) {
      if (state.user) {
        state.user.communicationPrefs = {
          ...state.user.communicationPrefs,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  authInitializationComplete,
  registerStart,
  registerFailure,
  logout,
  continueAsGuest,
  updateProfile,
  updateCommunicationPrefs,
} = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
