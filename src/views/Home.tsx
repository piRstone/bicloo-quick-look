import { useEffect, useState } from "react"

import FavoriteJourney from "~components/FavoriteJourney"
import FavoriteJourneyPlaceholder from "~components/FavoriteJourneyPlaceholder"
import StationItem from "~components/StationItem"
import { getStations } from "~services/api/stations"
import StorageService from "~services/storage"
import type { Station } from "~types/station"

const Home = () => {
  const [stations, setStations] = useState<Station[]>([])
  const [favoriteJourneyStartStation, setFavoriteJourneyStartStation] = useState<Station | undefined>(undefined)
  const [favoriteJourneyEndStation, setFavoriteJourneyEndStation] = useState<Station | undefined>(undefined)
  const [showFavoriteJourney] = useState<boolean>(StorageService.getShowFavoriteJourney())

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const rawStations = await getStations()
    const favoriteStationsNumbers = StorageService.getFavoriteStations()
    setStations(rawStations.filter((station) => favoriteStationsNumbers.includes(station.number)))

    // Favorite journey
    const favoriteStartStationNumber = StorageService.getFavoriteJourneyStations()[0]
    const favoriteEndStationNumber = StorageService.getFavoriteJourneyStations()[1]
    const startStation = rawStations.find((station) => station.number === favoriteStartStationNumber)
    const endStation = rawStations.find((station) => station.number === favoriteEndStationNumber)
    setFavoriteJourneyStartStation(startStation)
    setFavoriteJourneyEndStation(endStation)
  }

  return (
    <div>
      {stations.length === 0 ? (
        <p className="text-base font-thin mb-2">Ajoutez vos stations pour commencer ↗</p>
      ) : (
        <div className="flex flex-col gap-3 mb-2">
          {showFavoriteJourney ? (
            <FavoriteJourney startStation={favoriteJourneyStartStation} endStation={favoriteJourneyEndStation} />
          ) : (
            <FavoriteJourneyPlaceholder />
          )}
          <div className="flex flex-col gap-3 mb-2">
            {stations.map((station) => (
              <StationItem key={station.number} station={station} />
            ))}
          </div>
        </div>
      )}
      <p className="text-sm text-gray-400">Bicloo Quick Look v{process.env.PLASMO_PUBLIC_VERSION}</p>
    </div>
  )
}

export default Home
