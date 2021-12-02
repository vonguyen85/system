import { createSlice } from '@reduxjs/toolkit';

const testSlice = createSlice({
    name: "testing",
    initialState: {
        testing: null,
        isFetching: false,
        error: false,
    },
    reducers: {
        createTestingStart: state => {
            state.isFetching = true;
        },
        createTestingSuccess: (state, item) => {
            state.testing = null;
            state.isFetching = false;
            state.testing = item.payload;
            state.error = false;
        },
        createTestingFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateTestingAnswerSuccess: (state, item) => {
            state.isFetching = false;
            const payload = item.payload;
            state.testing.answer = payload;
            state.error = false;
        },
        finishTestingSuccess: state => {
            state.testing = null;
        },
    }
});

export const { 
    updateTestingAnswerSuccess,
    createTestingStart, createTestingSuccess, createTestingFailure,
    finishTestingSuccess
} = testSlice.actions;
export default testSlice.reducer;