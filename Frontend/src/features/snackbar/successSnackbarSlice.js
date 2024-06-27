import { createSlice } from '@reduxjs/toolkit';

const successSnackbarSlice = createSlice({
  name: 'successSnackbar',
  initialState: {
    isVisible: false,
    message: '',
  },
  reducers: {
    showSuccessSnackbar: (state, action) => {
      state.isVisible = true;
      state.message = action.payload;
    },
    hideSuccessSnackbar: (state) => {
      state.isVisible = false;
      state.message = '';
    },
  },
});

export const { showSuccessSnackbar, hideSuccessSnackbar } = successSnackbarSlice.actions;

export default successSnackbarSlice.reducer;
