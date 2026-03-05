import CreateReservationComponent from "../components/CreateReservationComponent";
import Sidebar from "../components/Sidebar";

export default function CreateReservation() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar/>
      <CreateReservationComponent/>
    </div>
  )
}
