import cogImage from "data-base64:assets/settings.png"
import { useReducer } from "react"

import "./style.css"

const IndexPopup = () => {
  const [count, increase] = useReducer((c) => c + 1, 0)

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bicloo Quick Look</h1>
        <div className="flex items-center gap-2">
          <button className="bg-none">
            <span className="text-3xl text-green-500 font-bold leading-none">+</span>
          </button>
          <button className="bg-none opacity-50 hover:opacity-100" onClick={() => increase()}>
            <img className="settings-icon" src={cogImage} alt="Settings" />
          </button>
        </div>
      </header>
      <p className="text-base font-thin my-2">Ajoutez vos stations pour commencer ↗</p>
      <p className="text-sm text-gray-400">Bicloo Quick Look {process.env.PLASMO_PUBLIC_VERSION}</p>
    </div>
  )
}

export default IndexPopup
