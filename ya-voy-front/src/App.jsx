import { Outlet } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"

function App() {

  return (
    <>
      <div className="w-full">
        <Sidebar />
        <Outlet />
      </div>
    </>
  )
}

export default App
