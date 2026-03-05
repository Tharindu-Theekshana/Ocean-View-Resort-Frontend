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

export const getAllReservations = async () => {
    try{
        const response = await api.get("/protected/reservation");
        return response.data;
    }catch(e){
        console.error(e);
    }
}

export const getReservationBill = async (id: any) => {
    try{
        const response = await api.get(`/protected/reservation/${id}/bill`, {
            responseType: "blob",
          });
        return response.data;
    }catch(e){
        console.error(e);
    }
}