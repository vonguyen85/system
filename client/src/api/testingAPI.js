import { createTestingFailure, createTestingStart, createTestingSuccess, finishTestingSuccess, updateTestingAnswerSuccess } from '../redux/testingRedux';
import { userRequest } from './requestMethod';

const testingAPI = {

    create: async (dispatch, token, data) => {
        dispatch(createTestingStart());
        try {
            const response = await userRequest.post("/testing", data, { headers: { token: token } });
            dispatch(createTestingSuccess(response));
            return response;
        } catch (err) {
            dispatch(createTestingFailure());
            alert(err.response.data.msg)
        }
    },
    updateAnswer: (dispatch, token, testingId, data) =>{
        try{
            userRequest.post(`/testing/updateAnswer?id=${testingId}`, data, { headers: { token: token } });
            dispatch(updateTestingAnswerSuccess(data));
        }
     catch (error) {
        alert(error.response.data.msg)
    }
},
    finish: async(dispatch, token, data) =>{
        try {
            const response = await userRequest.post("/testing/finish", data, { headers: { token: token } });
            dispatch(finishTestingSuccess());
            return response;
        } catch (error) {
            alert(error.response.data.msg)
        }
    },
    getTesting: async(token, data) =>{
        try {
            const response = await userRequest.get("/testing", { headers: { token: token }, params: data });
            return response;
        } catch (error) {
            alert(error.response.data.msg)
        }
    },
    getTestingNotFinish: async(token) =>{
        try {
            const response = await userRequest.get("/testing/student", { headers: { token: token } });
            return response;
        } catch (error) {
            alert(error.response.data.msg)
        }
    },
}


export default testingAPI;