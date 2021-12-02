import { createClassFailure, createClassStart, createClassSuccess, deleteClassFailure, deleteClassStart, deleteClassSuccess, getClassFailure, getClassStart, getClassSuccess, updateClassFailure, updateClassStart, updateClassSuccess } from '../redux/classRedux';
import { userRequest } from './requestMethod';

const classAPI = {
    getClass: async(dispatch,token) =>{
        dispatch(getClassStart());
        try{
            const response = await userRequest.get("/class/getbyownerid", {headers: { token: token }});
            dispatch(getClassSuccess(response));
            return response;
        }catch(err){
            dispatch(getClassFailure());
        }
    },

    updateClass: async(dispatch, token, id, data) =>{
        dispatch(updateClassStart());
        try{
            const result = await userRequest.put(`/class/${id}`,data, {headers: { token: token }});
            dispatch(updateClassSuccess(result));
            return result;
        }catch(err){
            dispatch(updateClassFailure());
            alert(err.response.data.msg);
        }
    },
    createClass: async(dispatch, token, data) =>{
        dispatch(createClassStart())
        try{
            const result = await userRequest.post(`/class`,data, {headers: { token: token }});
            dispatch(createClassSuccess(result));
            return result;
        }catch(err){
            dispatch(createClassFailure());
            alert(err.response.data.msg);
        }
    },
    deleteClass: async(dispatch, token, id) =>{
        dispatch(deleteClassStart())
        try{
            const result = await userRequest.delete(`/class/${id}`,{headers: { token: token }});
            console.log('result',result)
            dispatch(deleteClassSuccess(result));
        }catch(err){
            dispatch(deleteClassFailure());
            alert(err.response.data.msg);
        }
    },

}


export default classAPI;