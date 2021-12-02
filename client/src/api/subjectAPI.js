import { createSubjectFailure, createSubjectStart, createSubjectSuccess, deleteSubjectFailure, deleteSubjectStart, deleteSubjectSuccess, getSubjectFailure, getSubjectStart, getSubjectSuccess, updateSubjectFailure, updateSubjectStart, updateSubjectSuccess } from '../redux/subjectRedux';
import { userRequest } from './requestMethod';

const subjectAPI = {
    getAllSubjectByOwnerIdAndClassId: async(dispatch,token, classId) =>{
        dispatch(getSubjectStart());
        try{
            const response = await userRequest.get(`/subject/getbyowneridandClassId?classId=${classId}`, {headers: { token: token }});
            dispatch(getSubjectSuccess(response));
            return response;
        }catch(err){
            dispatch(getSubjectFailure());
        }
    },

    //get all subject of user
    getAllSubjectByOwnerId: async(dispatch,token) =>{
        dispatch(getSubjectStart());
        try{
            const response = await userRequest.get('/subject/getbyownerid', {headers: { token: token }});
            dispatch(getSubjectSuccess(response));
            return response;
        }catch(err){
            dispatch(getSubjectFailure());
        }
    },

    updateSubject: async(dispatch, token, id, name, classId) =>{
        dispatch(updateSubjectStart());
        try{
            const response = await userRequest.put(`/subject/${id}`,{name: name, classId: classId}, {headers: { token: token }});
            dispatch(updateSubjectSuccess(response));
            return response;
        }catch(err){
            dispatch(updateSubjectFailure());
            alert(err.response.data.msg);
        }
    },
    createSubject: async(dispatch, token, data) =>{
        dispatch(createSubjectStart());
        try{
            const response = await userRequest.post(`/subject`,data, {headers: { token: token }});
            dispatch(createSubjectSuccess(response));
            return response;
        }catch(err){
            dispatch(createSubjectFailure());
            alert(err.response.data.msg);
        }
    },
    deleteSubject: async(dispatch, token, id) =>{
        dispatch(deleteSubjectStart());
        try{
            const response = await userRequest.delete(`/subject/${id}`,{headers: { token: token }});
            dispatch(deleteSubjectSuccess(response));
            return response;
        }catch(err){
            dispatch(deleteSubjectFailure());
            alert(err.response.data.msg);
        }
    },

}


export default subjectAPI;