import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vk: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const vkSlice = createSlice({
  name: "vk",
  initialState,
  reducers: {
    vkLoading(state) {
      state.status = "loading";
    },
    vkReceived(state, action) {
      state.vk = action.payload;
      state.status = "succeeded";
    },
    vkFailed(state, action) {
      state.error = action.payload;
      state.status = "failed";
    },
  },
});

export const { vkLoading, vkReceived, vkFailed } = vkSlice.actions;
export default vkSlice.reducer;
