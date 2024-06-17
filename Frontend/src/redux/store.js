import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import transactionsReducer from "./transactionSlice";
// import snackBarReducer from "./snackBarSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    transactions: transactionsReducer,
    // snackBar: snackBarReducer,
  },
});
