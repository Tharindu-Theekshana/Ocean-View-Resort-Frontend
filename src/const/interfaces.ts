export interface tokenPayload {
    userId: number;
    role: number;   
}

export interface Room {
    id: number;
    type: string;
    price: number;
    description: string;
    imagePath: string;
}
  
export interface UserDetail {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
}
  
export interface Reservation {
    id: number;
    checkInDate: string;
    checkOutDate: string;
    netTotal: number | null;
    userDetail: UserDetail;
    room: Room;
}