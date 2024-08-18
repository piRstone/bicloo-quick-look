import bqlLogo from "data-base64:assets/icon128.png"
import { useEffect, useMemo, useState } from "react"

import { getStations } from "~services/api/stations"
import StorageService from "~services/storage"
import type { Station } from "~types/station"

import "./options.css"

import OptionsButton from "~components/OptionsButton"

const OptionsPage = () => {
  const [stations, setStations] = useState<Station[]>([])
  const [favoriteStationsNumbers] = useState<Station["number"][]>(StorageService.getFavoriteStations())
  const [favoriteStationNumber, setFavoriteStationNumber] = useState<Station["number"] | undefined>(undefined)
  const [favoriteStation, setFavoriteStation] = useState<Station | undefined>(undefined)
  const [favStationSaveStatus, setFavStationSaveStatus] = useState<boolean>(false)
  const [showBikeCount, setShowBikeCount] = useState<boolean>(StorageService.getShowBikeCount())
  const [refreshInterval, setRefreshInterval] = useState<number>(StorageService.getRefreshInterval())
  const [refreshIntervalStatus, setRefreshIntervalStatus] = useState<boolean>(false)
  const [showFavoriteJourney, setShowFavoriteJourney] = useState<boolean>(StorageService.getShowFavoriteJourney())
  const [favoriteStartStationNumber, setFavoriteStartStationNumber] = useState<Station["number"]>(
    StorageService.getFavoriteJourneyStations()[0]
  )
  const [favoriteEndStationNumber, setFavoriteEndStationNumber] = useState<Station["number"]>(
    StorageService.getFavoriteJourneyStations()[1]
  )
  const [favoriteJourneySaveStatus, setFavoriteJourneySaveStatus] = useState<boolean>(false)

  console.log("===", favoriteStartStationNumber, favoriteEndStationNumber)

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

    const favoriteStationNumber = StorageService.getFavoriteStation()
    setFavoriteStationNumber(favoriteStationNumber)
    setFavoriteStation(rawStations.find((station) => station.number === favoriteStationNumber))
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
      const refreshInterval = StorageService.getRefreshInterval()
      StorageService.setRefreshInterval(refreshInterval ?? -1)
      chrome.action.setBadgeText({ text: bikesCount.toString() })
      chrome.action.setBadgeBackgroundColor({ color: bikesCount > 0 ? "green" : "red" })
    } else {
      chrome.action.setBadgeText({ text: "" })
    }
  }

  const onChangeRefreshInterval = (value: number) => {
    StorageService.setRefreshInterval(value)
    setRefreshIntervalStatus(true)
    setTimeout(() => setRefreshIntervalStatus(false), 2000)
  }

  const onChangeShowFavoriteJourney = (showFavoriteJourney: boolean) => {
    StorageService.setShowFavoriteJourney(showFavoriteJourney)
    setShowFavoriteJourney(showFavoriteJourney)
  }

  const onSaveFavoriteStations = () => {
    StorageService.setFavoriteJourneyStations(favoriteStartStationNumber, favoriteEndStationNumber)
    setFavoriteJourneySaveStatus(true)
    setTimeout(() => setFavoriteJourneySaveStatus(false), 2000)
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
          <h3 className="text-base font-bold tracking-wider mb-2">MA STATION PRÉFÉRÉE</h3>
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
                  {!favoriteStationNumber && (
                    <option value={undefined} disabled>
                      Sélectionnez une station préférée
                    </option>
                  )}
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
          {showBikeCount && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Délai de raffraichissement (en minutes)</p>
              <div className="flex flex-row gap-2 items-center">
                <input
                  id="refresh-delay"
                  type="number"
                  min="1"
                  max="60"
                  className="px-2 pt-2 pb-1 text-lg bg-transparent border-b-4 border-gray-300 focus:border-green-500 outline-none"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                />
                <OptionsButton text="OK" onClick={() => onChangeRefreshInterval(refreshInterval)} />
                {refreshIntervalStatus && <span className="text-sm text-green-500">Enregistré</span>}
              </div>
            </div>
          )}
        </div>
        <div className="favorite-journey my-5">
          <h3 className="text-base font-bold tracking-wider mb-2">MON TRAJET PRÉFÉRÉ</h3>
          <p className="text-sm text-gray-500">
            Voyez d'un coup d'œil si un vélo et une place sont disponibles pour effectuer votre trajet préféré.
          </p>
          <div className="flex flex-row gap-2 items-center my-3">
            <input
              id="show-favorite-journey"
              type="checkbox"
              checked={showFavoriteJourney}
              onChange={(e) => onChangeShowFavoriteJourney(e.target.checked)}
            />
            <label htmlFor="show-favorite-journey" className="text-sm text-gray-500">
              Afficher le trajet préférée.
            </label>
          </div>
          {showFavoriteJourney && (
            <div>
              <div className="flex flex-row gap-2">
                <select
                  className="border p-1"
                  value={favoriteStartStationNumber}
                  onChange={(e) => setFavoriteStartStationNumber(Number(e.target.value))}>
                  <option value={undefined} disabled={!!favoriteStartStationNumber}>
                    Station de départ
                  </option>
                  {favoriteStations
                    .filter((s) => s.number !== favoriteEndStationNumber)
                    .map((station) => (
                      <option key={station.number} value={station.number}>
                        {station.name}
                      </option>
                    ))}
                </select>
                <select
                  className="border p-1"
                  value={favoriteEndStationNumber}
                  onChange={(e) => setFavoriteEndStationNumber(Number(e.target.value))}>
                  <option value={undefined} disabled={!!favoriteEndStationNumber}>
                    Station d'arrivée
                  </option>
                  {favoriteStations
                    .filter((s) => s.number !== favoriteStartStationNumber)
                    .map((station) => (
                      <option key={station.number} value={station.number}>
                        {station.name}
                      </option>
                    ))}
                </select>
                <OptionsButton text="OK" onClick={onSaveFavoriteStations} />
                {favoriteJourneySaveStatus && <span className="text-sm text-green-500">Enregistré</span>}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400">Bicloo Quick Look v{process.env.PLASMO_PUBLIC_VERSION} - Made with ❤️ by <a className="font-bold" href="https://pirstone.com" target="_blank" rel="noreferrer noopener">piRstone</a></p>
        <p className="text-xs text-gray-400 mt-1">Pour toute remarque ou suggestion : <a className="font-bold" href="mailto:contact@pirstone.com">contact@pirstone.com</a></p>
      </div>
    </div>
  )
}

export default OptionsPage
