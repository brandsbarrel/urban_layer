import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    id: 'usr_demo',
    name: 'Aniket',
    fullName: 'Aniket Sharma',
    email: 'aniket.s@urbanlayers.co',
    phone: '+91 98765 43210',
    currency: 'INR',
    language: 'EN',
    memberSince: 'Jan 2024',
    location: 'Gurugram, India',
    tier: 'Gold',
    nextTier: 'Platinum',
    tierProgress: 75,
    pointsToNextTier: 550,
    rewardPoints: 2450,
    activeCoupons: 3,
    profileCompletion: 85,
    avatarInitial: 'A',
    communicationPrefs: {
      emailUpdates: true,
      smsNotifications: true,
      whatsappConcierge: false,
    },
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
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  continueAsGuest,
  updateProfile,
  updateCommunicationPrefs,
} = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;