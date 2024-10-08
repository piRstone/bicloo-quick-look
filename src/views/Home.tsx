import { useEffect, useState } from "react"

import FavoriteJourney from "~Components/FavoriteJourney"
import FavoriteJourneyPlaceholder from "~Components/FavoriteJourneyPlaceholder"
import StationItem from "~Components/StationItem"
import { getStations } from "~services/api/stations"
import StorageService from "~services/storage"
import type { Station } from "~types/station"

const Home = () => {
  const [stations, setStations] = useState<Station[]>([])
  const [favoriteJourneyStartStation, setFavoriteJourneyStartStation] = useState<Station | undefined>(undefined)
  const [favoriteJourneyEndStation, setFavoriteJourneyEndStation] = useState<Station | undefined>(undefined)
  const [showFavoriteJourney, setShowFavoriteJourney] = useState<boolean>(false)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const rawStations = await getStations()
    const favoriteStationsNumbers = await StorageService.getStations()
    setStations(rawStations.filter((station) => favoriteStationsNumbers.includes(station.number)))

    // Favorite journey
    const isFavoriteJourneyEnabled = await StorageService.getShowFavoriteJourney()
    setShowFavoriteJourney(isFavoriteJourneyEnabled)
    const [favoriteStartStationNumber, favoriteEndStationNumber] = await StorageService.getFavoriteJourneyStations()
    const startStation = rawStations.find((station) => station.number === favoriteStartStationNumber)
    const endStation = rawStations.find((station) => station.number === favoriteEndStationNumber)
    setFavoriteJourneyStartStation(startStation)
    setFavoriteJourneyEndStation(endStation)

    // Update badge
    const showBikesCount = await StorageService.getShowBikeCount()
    if (showBikesCount) {
      const favoriteStationNumber = await StorageService.getFavoriteStation()
      const favStation = rawStations.find((station) => station.number === favoriteStationNumber)
      const availableBikes = favStation?.totalStands.availabilities.bikes
      const action = process.env.PLASMO_MANIFEST_VERSION === "mv3" ? chrome.action : chrome.browserAction
      action.setBadgeText({ text: availableBikes.toString() })
      action.setBadgeBackgroundColor({
        color: favStation?.totalStands.availabilities.bikes > 0 ? "green" : "red"
      })
    }
  }

  const handleRemoveStation = async (stationNumber: number) => {
    await StorageService.removeStation(stationNumber)
    setStations(stations.filter((station) => station.number !== stationNumber))
    init()
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
              <StationItem
                key={station.number}
                station={station}
                onRemoveStation={() => handleRemoveStation(station.number)}
              />
            ))}
          </div>
        </div>
      )}
      <p className="text-sm text-gray-400">Bicloo Quick Look v{process.env.PLASMO_PUBLIC_VERSION}</p>
    </div>
  )
}

export default Home
