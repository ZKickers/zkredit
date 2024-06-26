const txInitialState = {
  transactions: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const txReducers = {
  addTransaction(state, action) {
    state.transactions.push(action.payload);
  },
  updateTransaction(state, action) {
    const { id, updates } = action.payload;
    const existingTransaction = state.transactions.find((tx) => tx._id === id);
    if (existingTransaction) {
      Object.assign(existingTransaction, updates);
    }
  },
  deleteTransaction(state, action) {
    const { id } = action.payload;
    state.transactions = state.transactions.filter((tx) => tx._id !== id);
  },
  updateTransactionStatus(state, action) {
    const { id, status } = action.payload;
    const existingTransaction = state.transactions.find((tx) => tx._id === id);
    if (existingTransaction) {
      existingTransaction.status = status;
    }
  },
  transactionsLoading(state) {
    state.status = "loading";
  },
  transactionsReceived(state, action) {
    state.transactions = action.payload;
    state.status = "succeeded";
  },
  transactionsFailed(state, action) {
    state.error = action.payload;
    state.status = "failed";
  },
};

export { txInitialState, txReducers };
