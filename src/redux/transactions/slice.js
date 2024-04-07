import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addTransaction,
  deleteTransaction,
  fetchTransactionCategory,
  fetchTransactionsSummary,
  fetchTransactions,
  updateTransaction,
} from './operations';

const initialState = {
  transactions: {
    items: [],
    categories: [],
    isLoading: false,
    error: null,
  },
  summary: {
    categoriesSummary: [
      {
        name: '',
        type: '',
        total: 0,
      },
    ],
    incomeSummary: 0,
    expenseSummary: 0,
    periodTotal: 0,
    year: null,
    month: null,
  },
};
export const slice = createSlice({
  name: 'transactions',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, { payload }) => {
        state.transactions.items = payload;
      })
      .addCase(addTransaction.fulfilled, (state, { payload }) => {
        state.transactions.items.push(payload);
      })
      .addCase(deleteTransaction.fulfilled, (state, { payload }) => {
        state.transactions.items = state.transactions.items.filter(
          transaction => transaction.id !== payload.id
        );
      })
      .addCase(updateTransaction.fulfilled, (state, { payload }) => {
        state.transactions.items = state.transactions.items.map(transaction =>
          transaction.id === payload.data.id ? payload.data : transaction
        );
      })
      .addCase(fetchTransactionCategory.fulfilled, (state, { payload }) => {
        state.transactions.categories = payload;
      })
      .addCase(fetchTransactionsSummary.fulfilled, (state, { payload }) => {
        state.summary = payload;
      })
      .addMatcher(
        isAnyOf(
          fetchTransactions.fulfilled,
          deleteTransaction.fulfilled,
          addTransaction.fulfilled,
          fetchTransactionCategory.fulfilled
        ),
        (state, { payload }) => {
          state.transactions.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchTransactions.pending,
          deleteTransaction.pending,
          addTransaction.pending,
          fetchTransactionCategory.pending,
          fetchTransactionsSummary.pending
        ),
        (state, { payload }) => {
          state.transactions.isLoading = true;
          state.transactions.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchTransactions.rejected,
          deleteTransaction.rejected,
          addTransaction.rejected,
          fetchTransactionCategory.rejected,
          fetchTransactionsSummary.rejected
        ),
        (state, { payload }) => {
          state.transactions.error = payload;
          state.transactions.isLoading = false;
        }
      );
  },
});

export const transactionReducer = slice.reducer;
