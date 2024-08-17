import bqlLogo from "data-base64:assets/icon128.png";
import { useEffect, useMemo, useState } from "react";



import { getStations } from "~services/api/stations";
import StorageService from "~services/storage";
import type { Station } from "~types/station";






import "./options.css";



import OptionsButton from "~components/OptionsButton";





const OptionsPage = () => {
  const [stations, setStations] = useState<Station[]>([])
  const [favoriteStationsNumbers, setFavoriteStationsNumbers] = useState<Station["number"][]>([])
  const [favoriteStationNumber, setFavoriteStationNumber] = useState<Station["number"] | undefined>(undefined)
  const [favoriteStation, setFavoriteStation] = useState<Station | undefined>(undefined)
  const [favStationSaveStatus, setFavStationSaveStatus] = useState<boolean>(false)
  const [showBikeCount, setShowBikeCount] = useState<boolean>(false)

  const favoriteStations = useMemo(
    () => stations.filter((station) => favoriteStationsNumbers.includes(station.number)),
    [stations, favoriteStationsNumbers]
  )

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const rawStations = await getStations()
    setStations(rawStations)
    setFavoriteStationsNumbers(StorageService.getFavoriteStations())

    const favoriteStationNumber = StorageService.getFavoriteStation()
    setFavoriteStationNumber(favoriteStationNumber)
    setFavoriteStation(rawStations.find((station) => station.number === favoriteStationNumber))

    setShowBikeCount(StorageService.getShowBikeCount())
  }

  const onChangeFavoriteStation = (stationNumber: string | undefined) => {
    const value = stationNumber ? Number(stationNumber) : undefined
    setFavoriteStationNumber(value)
    StorageService.setFavoriteStation(stationNumber ? Number(stationNumber) : undefined)
    setFavStationSaveStatus(true)
    setTimeout(() => setFavStationSaveStatus(false), 2000)
  }

  const onChangeShowBikeCount = (showBikeCount: boolean) => {
    StorageService.setShowBikeCount(showBikeCount)
    setShowBikeCount(showBikeCount)
    if (showBikeCount) {
      const bikesCount = favoriteStation?.totalStands.availabilities.bikes
      chrome.action.setBadgeText({ text: bikesCount.toString() })
      chrome.action.setBadgeBackgroundColor({ color: bikesCount > 0 ? 'green' : 'red' })
    } else {
      chrome.action.setBadgeText({ text: "" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-screen-2xl m-auto my-4">
        <header className="flex flex-row items-center gap-3 mb-4">
          <img src={bqlLogo} alt="Logo" className="h-10" />
          <h1 className="text-5xl font-bold">Bicloo Quick Look</h1>
        </header>
        <h2 className="text-2xl font-bold tracking-wider">OPTIONS</h2>
        <div className="favorite-station my-5">
          <h3 className="text-base font-bold tracking-wider">MA STATION PRÉFÉRÉE</h3>
          <p className="text-sm text-gray-500">
            Définissez votre station préférée pour afficher sur l'icône de l'extension le nombre de vélos disponibles.
          </p>
          <div className="flex flex-row gap-2 items-center my-3">
            {!favoriteStations.length ? (
              <p className="text-sm text-gray-500">
                Ajoutez au moins une station pour la définir comme votre préférée.
                <br />
                Depuis l'extension, cliquez sur le bouton "Plus" pour ajouter une station.
              </p>
            ) : (
              <>
                <select
                  className="border p-1"
                  value={favoriteStationNumber}
                  onChange={(e) => onChangeFavoriteStation(e.target.value)}>
                  {!favoriteStationNumber && <option value={undefined}>---</option>}
                  {favoriteStations.map((station) => (
                    <option key={station.number} value={station.number}>
                      {station.name}
                    </option>
                  ))}
                </select>
                {favStationSaveStatus && <span className="text-sm text-green-500">Enregistré</span>}
              </>
            )}
          </div>
          <div className="flex flex-row gap-2 items-center my-3">
            <input
              id="show-bike-count"
              type="checkbox"
              checked={showBikeCount}
              onChange={(e) => onChangeShowBikeCount(e.target.checked)}
            />
            <label htmlFor="show-bike-count" className="text-sm text-gray-500">
              Afficher le nombre de vélos pour ma station préférée.
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OptionsPage
