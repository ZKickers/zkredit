// src/features/snackbar/snackbarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    isVisible: false,
    message: '',
  },
  reducers: {
    showSnackbar: (state, action) => {
      state.isVisible = true;
      state.message = action.payload;
    },
    hideSnackbar: (state) => {
      state.isVisible = false;
      state.message = '';
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
