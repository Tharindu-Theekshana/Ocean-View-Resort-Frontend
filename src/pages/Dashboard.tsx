import DashboardComponent from "../components/DashboardComponent";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <DashboardComponent />
    </div>
  );
}