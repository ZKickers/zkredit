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
    state.status = "succeeded";
    state.transactions = action.payload;
  },
  transactionsFailed(state, action) {
    state.status = "failed";
    state.error = action.payload;
  },
};

export { txInitialState, txReducers };
