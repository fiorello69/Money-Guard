import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { login, logout, refreshThunk, register } from './operations';
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../../redux/transactions/operations';

const initialState = {
  user: {
    email: '',
    password: '',
  },
  balance: 0,
  token: '',
  isLoggedIn: false,
  isLoading: false,
  isRefresh: false,
};
export const slice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(logout.fulfilled, (state, { payload }) => {
        return (state = initialState);
      })
      .addCase(refreshThunk.pending, (state, { payload }) => {
        state.isRefresh = true;
      })
      .addCase(refreshThunk.rejected, (state, { payload }) => {
        state.isRefresh = false;
      })
      .addCase(refreshThunk.fulfilled, (state, { payload }) => {
        state.isRefresh = false;
        state.isLoggedIn = true;
        state.user.email = payload.email;
        state.balance = payload.balance;
      })
      .addCase(addTransaction.fulfilled, (state, { payload }) => {
        state.balance = payload.balanceAfter;
      })
      .addCase(updateTransaction.fulfilled, (state, { payload }) => {
        state.balance = payload.freshData.balance;
      })
      .addCase(deleteTransaction.fulfilled, (state, { payload }) => {
        state.balance = payload.data.balance;
      })
      .addMatcher(
        isAnyOf(login.pending, register.pending, state => {
          state.isLoading = true;
        })
      )
      .addMatcher(
        isAnyOf(login.fulfilled, register.fulfilled),
        (state, { payload }) => {
          state.user = payload.user;
          state.balance = payload.user.balance;
          state.token = payload.token;
          state.isLoading = false;
          state.isLoggedIn = true;
        }
      );
  },
});

export const authReducer = slice.reducer;
