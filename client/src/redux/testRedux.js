import { createSlice } from '@reduxjs/toolkit';

const testSlice = createSlice({
    name: "test",
    initialState: {
        arrTest: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        getTestStart: state => {
            state.isFetching = true;
        },
        getTestSuccess: (state, item) => {
            state.isFetching = false;
            state.arrTest = item.payload;
            state.error = false;
        },
        getTestFailure: (state) => {
            state.isFetching = false;
            state.error = true;
            state.arrTest = [];
        },
        createClassStart: state => {
            state.isFetching = true;
        },
        createClassSuccess: (state, item) => {
            state.isFetching = false;
            state.arrClass.push(item.payload);
            state.error = false;
        },
        createClassFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        updateClassStart: state => {
            state.isFetching = true;
        },
        updateClassSuccess: (state, item) => {
            state.isFetching = false;
            state.arrClass[state.arrClass.findIndex(i => i._id === item.payload._id)] = item.payload;
            state.error = false;
        },
        updateClassFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        deleteTestStart: state => {
            state.isFetching = true;
        },
        deleteTestSuccess: (state, item) => {
            state.isFetching = false;
            const index = state.arrTest.findIndex(i => i.test._id === item.payload._id);
            state.arrTest.splice(index, 1);
            state.error = false;
        },
        deleteTestFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    }
});

export const { 
    getTestStart, getTestSuccess, getTestFailure, 
    updateClassStart, updateClassSuccess, updateClassFailure,
    createClassStart, createClassSuccess, createClassFailure,
    deleteTestStart, deleteTestSuccess, deleteTestFailure,
} = testSlice.actions;
export default testSlice.reducer;