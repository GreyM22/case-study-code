import { createSlice } from "@reduxjs/toolkit";
import {createAction, props} from '@ngrx/store';

export interface User {
  token: string;
  departmentId: number;
  role: string;
  positionsId: number[];
  employeesId: number[];
}

//reducer
const slice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    departmentId: null,
    role: null,
    positionsId: [],
    employeesId: []
  },
  reducers: {
    userLoggedIn: (user, action) => {
      user.token = action.payload.token;
      user.departmentId = action.payload.departmentId;
      user.role = action.payload.role;
      user.positionsId = action.payload.positionsId;
      user.employeesId = action.payload.employeesId;
    },
    userLoggedOut: (user, action) => {
      user.token = null;
      user.departmentId = null;
      user.role = null;
      user.positionsId = [];
      user.employeesId = [];
    }
  }
});

export default slice.reducer;

const { userLoggedIn, userLoggedOut } = slice.actions;

// Actions
export const logUser = createAction(
  userLoggedIn.type,
  props<{
    payload: {
      token: string;
      departmentId: number;
      role: string;
      positionsId: number[];
      employeesId: number[];
    } }>()
);

export const logoutUser = createAction(userLoggedOut.type);

// feature key
export const authFeatureKey = 'user';
