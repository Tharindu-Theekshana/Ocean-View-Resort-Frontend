import api from "./api";

export const getRoomsByCategory = async (category: string) => {
    try{
        const response = await api.get("/room", {
            params: {
                type: category
            }
        })
        return response.data;
    }catch(e){
        console.error(e);
    }
}
