import api from "./api";

export const register = async (payload:any) => {
    try{
        const response = await api.post("/auth", payload);
        return response.data;
    }catch(e){
        console.error(e);
    }
}

export const login = async (payload:any) => {
    try{
        const response = await api.post("/auth/login", payload);
        return response.data;
    }catch(e){
        console.error(e);
    }
}