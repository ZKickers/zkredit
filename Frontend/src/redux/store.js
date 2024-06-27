import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import clientTxReducer from "./clientTransactionSlice";
import creditorTxReducer from "./creditorTransactionSlice";
import snackbarReducer from '../features/snackbar/snackbarSlice';
import successSnackbarReducer from '../features/snackbar/successSnackbarSlice';
import vkSlice from "./vkSlice";
// import snackBarReducer from "./snackBarSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    clientTransactions: clientTxReducer,
    creditorTransactions: creditorTxReducer,
    snackbar: snackbarReducer,
    successSnackbar: successSnackbarReducer,
    vk: vkSlice,
    // snackBar: snackBarReducer,
  },
});
