import { createSlice } from '@reduxjs/toolkit';
import {createAction, props} from '@ngrx/store';

export interface ErrorMessage {
  message: string;
}

// create reducer
const slice = createSlice({
  name: 'error',
  initialState: { message: null },
  reducers: {
    errorShowed: (error, action) => {
      error.message = action.payload.message;
    },
    errorRemoved: (error, action) => {
      error.message = null;
    }
  }
});

export default slice.reducer;

const { errorShowed, errorRemoved} = slice.actions;

// Actions
export const showError = createAction(
  errorShowed.type,
  props<{ payload: { message: string } }>()
);

export const removeError = createAction(errorRemoved.type);

// feature key
export const errorFeatureKey = 'error';
