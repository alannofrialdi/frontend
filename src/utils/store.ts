import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice"; // Example reducer

// Configure the Redux store
const store = configureStore({
  reducer: {
    user: userReducer, // Add your reducers here
  },
});

// Export the store
export default store;

// Export RootState and AppDispatch for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
