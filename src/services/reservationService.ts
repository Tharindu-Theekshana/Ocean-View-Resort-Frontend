import api from "./api";

export const makeReservation = async (payload: any) => {
    try{
        const response = await api.post("/protected/reservation", payload);
        return response.data;
    }catch(e){
        console.error(e);
    }
}

export const getReservationsByUserId = async (userId: any) => {
    try{
        const response = await api.get(`/protected/reservation/${userId}`);
        return response.data;
    }catch(e){
        console.error(e)
    }
}