import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,

  error: null,
  message: null,
};
const forgotPassSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    forgotPassRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPassSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    forgotPassFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetPassRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPassSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    resetPassFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    clearAllError(state, action) {
      state.error = null;
      state = state;
    },
  },
});

export const forgotPass = (email) => async (dispatch) => {
  dispatch(forgotPassSlice.actions.forgotPassRequest());

  try {
    const { data } = await axios.post(
      "http://localhost:4000/api/v1/user/password/forgot",
      { email },
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );

    dispatch(forgotPassSlice.actions.forgotPassSuccess(data.message || data))
    dispatch(forgotPassSlice.actions.clearAllError());
    return data;
  } catch (error) {
    dispatch(
      forgotPassSlice.actions.forgotPassFailed(
        error?.response?.data?.message || "forgot pass failed"
      )
    );
  }
};


export const resetPass = (token,password,confirmPassword) => async (dispatch) => {
    dispatch(forgotPassSlice.actions.resetPassRequest());

    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/password/reset/${token}`,
        { password,confirmPassword},
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
  
      dispatch(forgotPassSlice.actions.resetPassSuccess(data.message || data))
      dispatch(forgotPassSlice.actions.clearAllError());
      return data;
    } catch (error) {
      dispatch(
        forgotPassSlice.actions.resetPassFailed(
          error?.response?.data?.message || "reset pass failed"
        )
      );
    }
};

export const clearAllForgotPassErrors = () => (dispatch) => {
  dispatch(forgotPassSlice.actions.clearAllError());
};
export default forgotPassSlice.reducer;
