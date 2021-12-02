import { deleteTestFailure, deleteTestStart, deleteTestSuccess, getTestFailure, getTestStart, getTestSuccess } from '../redux/testRedux';
import { userRequest } from './requestMethod';

const testAPI = {
    getQuestion: async (token, subjectId, numQuestion) => {
        try {
            const response = await userRequest.get("question/random", {
                headers: { token: token },
                params: {
                    subjectId,
                    numQuestion
                }
            });
            return response;
        } catch (err) {
            console.log(err)
        }
    },
    create: async (token, data) => {
        try {
            const response = await userRequest.post("/test", data, { headers: { token: token } });
            return response;
        } catch (err) {
            alert(err.response.data.msg)
        }
    },
    getTest: async(dispatch,token) =>{
        dispatch(getTestStart());
        try{
            const response = await userRequest.get("/test", {headers: { token: token }});
            dispatch(getTestSuccess(response));
            return response;
        }catch(err){
            dispatch(getTestFailure());
        }
    },
    getTestStudent: async(dispatch,token) =>{
        dispatch(getTestStart());
        try{
            const response = await userRequest.get("/test/student", {headers: { token: token }});
            dispatch(getTestSuccess(response));
            return response;
        }catch(err){
            dispatch(getTestFailure());
        }
    },
    update: async (token, data) => {
        try {
            const response = await userRequest.put("/test", data, { headers: { token: token }, params: data });
            return response;
        } catch (err) {
            alert(err.response.data.msg)
        }
    },
    delete: async (dispatch, token, id) => {
        try {
            dispatch(deleteTestStart());
            const response = await userRequest.delete( `/test/${id}`, { headers: { token: token } });
            console.log('response',response) 
            dispatch(deleteTestSuccess(response));
            return response;
        } catch (err) {
            dispatch(deleteTestFailure());
            alert(err.response.data.msg)
        }
    },
}


export default testAPI;