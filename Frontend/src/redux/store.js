import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import clientTxReducer from "./clientTransactionSlice";
import creditorTxReducer from "./creditorTransactionSlice";
// import snackBarReducer from "./snackBarSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    clientTransactions: clientTxReducer,
    creditorTransactions: creditorTxReducer,
    // snackBar: snackBarReducer,
  },
});
