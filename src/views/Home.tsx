import { useEffect, useState } from "react"

import StationItem from "~components/StationItem"
import { getStations } from "~services/api/stations"
import StorageService from "~services/storage"
import type { Station } from "~types/station"

const Home = () => {
  const [stations, setStations] = useState<Station[]>([])

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const rawStations = await getStations()
    const favoriteStationsNumbers = StorageService.getFavoriteStations()
    setStations(rawStations.filter((station) => favoriteStationsNumbers.includes(station.number)))
  }

  return (
    <div>
      {stations.length === 0 ? (
        <p className="text-base font-thin mb-2">Ajoutez vos stations pour commencer ↗</p>
      ) : (
        <div className="flex flex-col gap-3 mb-2">
          {stations.map((station) => (
            <StationItem key={station.number} station={station} />
          ))}
        </div>
      )}
      <p className="text-sm text-gray-400">Bicloo Quick Look {process.env.PLASMO_PUBLIC_VERSION}</p>
    </div>
  )
}

export default Home
