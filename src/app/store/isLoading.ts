import { createSlice } from '@reduxjs/toolkit';
import {createAction, props} from '@ngrx/store';

export interface IsLoading {
  loading: boolean;
}

// create reducer
const slice = createSlice({
  name: 'loading',
  initialState: { loading: false },
  reducers: {
    isLoading: (loader, action) => {
      loader.loading = true;
    },
    notLoading: (loader, action) => {
      loader.loading = false;
    }
  }
});

export default slice.reducer;

const { isLoading, notLoading } = slice.actions;

// Actions
export const startLoading = createAction(isLoading.type);

export const stopLoading = createAction(notLoading.type);

// feature key
export const loadingFeatureKey = 'loading';
