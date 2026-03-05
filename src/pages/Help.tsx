import HelpComponent from "../components/HelpComponent";
import Sidebar from "../components/Sidebar";

export default function Help() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar/>
      <HelpComponent/>
    </div>
  )
}
