import { createSlice } from '@reduxjs/toolkit';

const subjectSlice = createSlice({
    name: "subject",
    initialState: {
        arrSubject: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        getSubjectStart: state => {
            state.isFetching = true;
        },
        getSubjectSuccess: (state, item) => {
            state.isFetching = false;
            state.arrSubject = item.payload;
            state.error = false;
        },
        getSubjectFailure: (state) => {
            state.isFetching = false;
            state.error = true;
            state.arrSubject = null;
        },
        updateSubjectStart: state => {
            state.isFetching = true;
        },
        updateSubjectSuccess: (state, item) => {
            state.isFetching = false;
            state.arrSubject[state.arrSubject.findIndex(subject => subject._id === item.payload._id)] = item.payload;
            state.error = false;
        },
        updateSubjectFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        createSubjectStart: state => {
            state.isFetching = true;
        },
        createSubjectSuccess: (state, item) => {
            state.isFetching = false;
            state.arrSubject.push(item.payload);
            state.error = false;
        },
        createSubjectFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        deleteSubjectStart: state => {
            state.isFetching = true;
        },
        deleteSubjectSuccess: (state, item) => {
            state.isFetching = false;
            state.arrSubject.splice(state.arrSubject.findIndex(subject => subject._id === item.payload._id), 1);
            state.error = false;
        },
        deleteSubjectFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
    }
});

export const { 
    getSubjectStart, getSubjectSuccess, getSubjectFailure, 
    updateSubjectStart, updateSubjectSuccess, updateSubjectFailure,
    createSubjectStart, createSubjectSuccess, createSubjectFailure,
    deleteSubjectStart, deleteSubjectSuccess, deleteSubjectFailure,

} = subjectSlice.actions;
export default subjectSlice.reducer;