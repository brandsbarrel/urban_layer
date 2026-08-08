import { createSlice } from '@reduxjs/toolkit';

// Demo user pre-populated (jaise cart/wishlist mein bhi demo data hai) —
// taaki Account Dashboard bina real login ke bhi turant dekha ja sake.
const initialState = {
  user: {
    id: 'usr_demo',
    name: 'Aniket',
    email: 'aniket@example.com',
    tier: 'Gold',
    nextTier: 'Platinum',
    tierProgress: 75,
    pointsToNextTier: 550,
    rewardPoints: 2450,
    activeCoupons: 3,
    avatarInitial: 'A',
  },
  isAuthenticated: true,
  status: 'idle',
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
      state.user = { ...state.user, ...action.payload, isGuest: false };
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
      state.user = { ...state.user, ...action.payload, isGuest: false };
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