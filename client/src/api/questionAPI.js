import { userRequest } from './requestMethod';

const questionAPI = {
    createMulti: async(token, data) =>{
        try{
            const result = await userRequest.post(`/question/multi_create`,data, {headers: { token: token }});
            return result;
        }catch(err){
            alert(err.response.data.msg);
        }
    },
    getBySubjectId: async(token, subjecId) => {
        try{
            const result = await userRequest.get(`/question?subjectId=${subjecId}`, {headers: { token: token }});
            return result;
        }catch(err){
            // alert(err.response.data.msg);
        }
    },
    getByarrQuestionId: async(token, data) => {
        try{
            const result = await userRequest.get(`/question/arrayQuestion`, {headers: { token: token }, params:{data}});
            return result;
        }catch(err){
            // alert(err.response.data.msg);
        }
    },
    getRandom: async(token, subjectId, numQuestion) =>{
        try{
            const response = await userRequest.get("question/random", {headers: { token: token }, 
            params:{
                subjectId,
                numQuestion
            }});
            return response;
        }catch(err){
            alert(err.response.data.msg);
        }
    },
    delete: async(token, data) =>{
        try{
            const response = await userRequest.delete("question",{headers: { token: token }, params: data});
            return response;
        }catch(err){
            alert(err.response.data.msg);
        }
    },
    update: async(token, data) =>{
        try{
            const response = await userRequest.put("question",data, {headers: { token: token }});
            return response;
        }catch(err){
            alert(err.response.data.msg);
        }
    },
    
}


export default questionAPI;