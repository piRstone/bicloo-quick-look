import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

import { getStations } from "~services/api/stations"
import StorageService from "~services/storage"
import StationListItem from "~components/StationListItem"
import type { Station } from "~types/station"

const StationsList = () => {
  const [apiStations, setApiStations] = useState<Station[]>([])
  const [stations, setStations] = useState<Station[]>([])

  const navigation = useNavigate()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const rawStations = await getStations()
    setApiStations(rawStations)
    setStations(rawStations.sort((s1, s2) => (s1.number > s2.number ? 1 : -1)))
    const favStations = await StorageService.getFavoriteStations()
  }

  const filterStations = (search: string) => {
    if (search.length === 0) {
      setStations(apiStations)
      return
    }
    const filteredStations = apiStations.filter((station) => station.name.toLowerCase().includes(search.toLowerCase()))
    setStations(filteredStations)
  }

  const onAddStationToFavorite = (station: Station) => {
    StorageService.addFavoriteStation(station)
    navigation("/")
  }

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Rechercher..."
        className="flex-1 text-sm bg-gray-300 rounded-md px-2 py-1 mb-5 placeholder:text-gray-500"
        onChange={(e) => filterStations(e.target.value)}
      />

      {stations.map((station) => (
        <StationListItem key={station.number} station={station} onClickStation={() => onAddStationToFavorite(station)} />
      ))}
    </div>
  )
}

export default StationsList
