import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// import snackBarReducer from "./snackBarSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    // snackBar: snackBarReducer,
  },
});
