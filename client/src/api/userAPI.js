import {
    getStudentStart, getStudentSuccess
} from '../redux/studentRedux';
import { loginFailure, loginStart, loginSuccess, logoutSuccess } from '../redux/userRedux';
import { publicRequest, userRequest } from './requestMethod';

const userAPI = {
    register: async(user) =>{
        try{
            const response = await publicRequest.post("/user/register", user);
            localStorage.setItem('isLogin', true);
            return response.data.msg;
        }catch(err){ 
            return err.response.data.msg;
        }
    },
    login: async(dispatch, user) =>{
        dispatch(loginStart());
        try{
            const response = await publicRequest.post("/user/login", user);
            // localStorage.setItem('token', response.data.token);
            dispatch(loginSuccess(response.data));
            return response;
        }catch(err){
            alert('Đăng nhập không thành công!')
            dispatch(loginFailure());
        }
    },
    logout: dispatch =>{
        dispatch(logoutSuccess());
    },

    addMultiStudent: async(token, data) =>{
        try{
            const response = await userRequest.post(`/user/addMultiStudent`,data, {headers: { token: token }});
            return response;
        }catch(err){
            return err.response.data.msg;
        }
    },
    getUser: async(token, dispatch, data = null) =>{
        try{
            if(data){
                dispatch(getStudentStart());
                var queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');
                const response = await userRequest.get(`/user?${queryString}`, {headers: { token: token }});
                dispatch(getStudentSuccess(response));
                return response;
            }
            else{
                const response = await userRequest.get("/user", {headers: { token: token }});
                return response;
            }
        }catch(err){
            return err.response.data.msg;
        }
    },
    checkedTested: async(token, id) =>{
        try {
            const response = await userRequest.get(`/user/student/${id}`, {headers: { token: token }});
            return response;
        } catch (err) {
            alert(err.response.data.msg);
        }
    },
    deleteStudent: async(token, id) =>{
        try {
            const response = await userRequest.delete(`/user/student/${id}`, {headers: { token: token }});
            return response;
        } catch (err) {
            alert(err.response.data.msg);
        }
    },
    changePass: async(token, data) =>{
        try {
            const response = await userRequest.post(`/user/changePass`, data, {headers: { token: token }});
            return response;
        } catch (err) {
            alert(err.response.data.msg);
        }
    },

}


export default userAPI;