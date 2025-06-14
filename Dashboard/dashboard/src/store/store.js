import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice.js";
import forgotRestPassSlice from "./slices/forgotRestPassSlice.js";

export const store = configureStore({
    reducer: {
        user: userSlice,
        forgotPass: forgotRestPassSlice
    },
  })