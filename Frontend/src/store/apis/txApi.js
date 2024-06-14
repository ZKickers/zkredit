import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.REACT_APP_BACKEND_SERVER;

export const transactionsApi = createApi({
  reducerPath: "transactions",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints(builder) {
    return {
      fetchTransactions: builder.query({
        query: (props) => {
          const { accountId, token, type } = props;
          return {
            url: `/getTX/${type}`,
            params: { clientId: accountId },
            headers: { Authorization: token },
            method: "GET",
          };
        },
      }),
      fetchCreditorUsername: builder.query({
        query: (props) => {
          const { token, txId, creditorId } = props;
          return {
            url: `/getTX/CreditorUsername`,
            params: { txId, creditorId },
            headers: { Authorization: token },
            method: "GET",
          };
        },
      }),
      addTransaction: builder.mutation({
        query: (props) => {
          const { token, data } = props;
          return {
            url: "/ClientRequest",
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: data,
          };
        },
      }),
      updateThreshold: builder.mutation({
        query: (props) => {
          const { txId, threshold } = props;
          return {
            url: "/Creditor/trigger-threshold",
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: {
              threshold,
              txId,
            },
          };
        },
      }),
    };
  },
});

export const {
  useFetchTransactionsQuery,
  useFetchCreditorUsernameQuery,
  useAddTransactionMutation,
  useUpdateThresholdMutation,
} = transactionsApi;
