import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        isFetching: false,
        error: false,
    },
    reducers: {
        loginStart: state => {
            state.isFetching = true;
        },
        loginSuccess: (state, user) => {
            state.isFetching = false;
            state.currentUser = user.payload;
            state.error = false;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
            state.currentUser = null;
        },
        logoutSuccess: state => {
            state.currentUser = null;
        },

    }
});

export const { loginStart, loginSuccess, loginFailure, logoutSuccess } = userSlice.actions;
export default userSlice.reducer;