import AddRoomComponent from "../components/AddRoomComponent";
import Sidebar from "../components/Sidebar";

export default function AddRoom() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar/>
      <AddRoomComponent/>
    </div>
  )
}
