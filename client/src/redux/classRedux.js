import { createSlice } from '@reduxjs/toolkit';

const classSlice = createSlice({
    name: "class",
    initialState: {
        arrClass: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        getClassStart: state => {
            state.isFetching = true;
        },
        getClassSuccess: (state, item) => {
            state.isFetching = false;
            state.arrClass = item.payload;
            state.error = false;
        },
        getClassFailure: (state) => {
            state.isFetching = false;
            state.error = true;
            state.arrClass = [];
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
        deleteClassStart: state => {
            state.isFetching = true;
        },
        deleteClassSuccess: (state, item) => {
            state.isFetching = false;
            state.arrClass.splice(state.arrClass.findIndex(i => i._id === item.payload._id), 1);
            state.error = false;
        },
        deleteClassFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    }
});

export const { 
    getClassStart, getClassSuccess, getClassFailure, 
    updateClassStart, updateClassSuccess, updateClassFailure,
    createClassStart, createClassSuccess, createClassFailure,
    deleteClassStart, deleteClassSuccess, deleteClassFailure,
} = classSlice.actions;
export default classSlice.reducer;