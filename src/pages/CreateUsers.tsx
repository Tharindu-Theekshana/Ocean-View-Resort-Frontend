import CreateUsersComponent from "../components/CreateUsersComponent";
import Sidebar from "../components/Sidebar";

export default function CreateUsers() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar/>
      <CreateUsersComponent/>
    </div>
  )
}
