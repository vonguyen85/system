import { createSlice } from '@reduxjs/toolkit';

const studentSlice = createSlice({
    name: "student",
    initialState: {
        arrStudent: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        getStudentStart: state => {
            state.isFetching = true;
        },
        getStudentSuccess: (state, item) => {
            state.isFetching = false;
            state.arrStudent = item.payload;
            state.error = false;
        },
        getStudentFailure: (state) => {
            state.isFetching = false;
            state.error = true;
            state.arrStudent = null;
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
    getStudentStart, getStudentSuccess, getStudentFailure, 
    updateSubjectStart, updateSubjectSuccess, updateSubjectFailure,
    createSubjectStart, createSubjectSuccess, createSubjectFailure,
    deleteSubjectStart, deleteSubjectSuccess, deleteSubjectFailure,

} = studentSlice.actions;
export default studentSlice.reducer;