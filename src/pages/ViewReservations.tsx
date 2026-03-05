import Sidebar from "../components/Sidebar";
import ViewReservationsComponent from "../components/ViewReservationsComponent";

export default function ViewReservations() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar/>
      <ViewReservationsComponent/>
    </div>
  )
}
