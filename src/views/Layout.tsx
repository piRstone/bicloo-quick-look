import cogImage from "data-base64:assets/settings.png"
import { Outlet, useLocation, useNavigate } from "react-router-dom"

const Layout = () => {
  const navigation = useNavigate()
  const location = useLocation()

  const isStationsListOpen = location.pathname === "/stations"

  return (
    <div>
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Bicloo Quick Look</h1>
        <div className="flex items-center gap-2">
          {isStationsListOpen ? (
            <button className="bg-none" onClick={() => navigation("/")}>
              <span className="text-sm text-white font-bold leading-2 bg-red-600 rounded-sm px-1">Fermer</span>
            </button>
          ) : (
            <button className="bg-none" onClick={() => navigation("/stations")}>
              <span className="text-3xl text-green-500 font-bold leading-none">+</span>
            </button>
          )}
          <button className="bg-none opacity-50 hover:opacity-100" onClick={() => {}}>
            <img className="settings-icon" src={cogImage} alt="Settings" />
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
