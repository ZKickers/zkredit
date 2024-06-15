import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    username: "",
    accountId: "",
    createdAt: "",
  };
  
  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setUser: (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.username = action.payload.username;
        state.accountId = action.payload.accountId;
        state.createdAt = action.payload.createdAt;
      },
      removeUser: (state) => {
        state.isLoggedIn = false;
        state.username = "";
        state.accountId = "";
        state.createdAt = "";
      },
    },
  });
  
  export const { setUser, removeUser } = userSlice.actions;
  export default userSlice.reducer;
  