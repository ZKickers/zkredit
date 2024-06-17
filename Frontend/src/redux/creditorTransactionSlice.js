import { createSlice } from "@reduxjs/toolkit";
import { txInitialState, txReducers } from "./transactionSliceProps";

const transactionsSlice = createSlice({
  name: "creditorTransactions",
  initialState: txInitialState,
  reducers: txReducers,
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  updateTransactionStatus,
  transactionsLoading,
  transactionsReceived,
  transactionsFailed,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
