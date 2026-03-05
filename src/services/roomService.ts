import api from "./api";

export const getRoomsByCategory = async (category: string) => {
    try{
        const response = await api.get("/room/type", {
            params: {
                type: category
            }
        })
        return response.data;
    }catch(e){
        console.error(e);
    }
}

export const getAllRooms = async () => {
    try{
        const response = await api.get("/room");
        return response.data;
    }catch(e){
        console.error(e);
    }
}

export const createRoom = async (formData: FormData) => {
    try {
      const response = await api.post("/room", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };