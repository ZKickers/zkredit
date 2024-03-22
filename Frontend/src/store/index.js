import { configureStore } from "@reduxjs/toolkit";
import { transactionsApi } from "./apis/txApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(transactionsApi.middleware);
  },
});

setupListeners(store.dispatch);

export {
  useFetchTransactionsQuery,
  useFetchCreditorUsernameQuery,
  useAddTransactionMutation,
} from "store/apis/txApi";
