import { useNavigate } from 'react-router-dom'


export default function NotFound() {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-blue-50 px-4 text-center">
    <h1 className="text-[80px] font-extrabold text-blue-950">404</h1>
    <p className="text-2xl font-semibold text-blue-800 mt-2">Oops! Page Not Found</p>
    <p className="text-md text-blue-700 mt-2">The page you're looking for doesn't exist or has been moved.</p>
    <button onClick={()=>{navigate("/")} } className="mt-6 bg-blue-950 text-white text-lg px-6 py-2 rounded-md hover:bg-blue-800 transition duration-300 shadow-md">
      Go Back Home
    </button>
  </div>
  )
}