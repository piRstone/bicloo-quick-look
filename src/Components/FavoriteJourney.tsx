import bikeIcon from "data-base64:assets/bike.png"
import markerIcon from "data-base64:assets/marker.png"
import rightArrow from "data-base64:assets/right-arrow.png"
import { useMemo } from "react"

import type { Station } from "~types/station"

type FavoriteJourneyProps = {
  startStation: Station
  endStation: Station
}

const FavoriteJourney = ({ startStation, endStation }: FavoriteJourneyProps) => {
  if (!startStation || !endStation) return null

  const gradientClass = useMemo(() => {
    if (startStation.totalStands.availabilities.bikes === 0 || endStation.totalStands.availabilities.stands === 0) {
      return "from-red-600 to-red-500"
    } else if (startStation.totalStands.availabilities.bikes < 3 || endStation.totalStands.availabilities.stands < 3) {
      return "from-amber-600 to-amber-500"
    }
    return "from-lime-600 to-lime-500"
  }, [startStation, endStation])

  return (
    <div
      className={`flex flex-col gap-2 items-center text-white rounded-md py-3 px-5 bg-gradient-to-r ${gradientClass}`}>
      <p className="text-xs font-bold">MON TRAJET PRÉFÉRÉ</p>
      <div className="flex flex-row items-center justify-around w-full">
        <div className="flex flex-col">
          <p className="text-xs">{startStation.name}</p>
          <div className="flex flex-row items-center justify-center gap-1">
            <img src={bikeIcon} alt="Vélo" className="h-7" />
            <p className="text-xl font-bold">{startStation.totalStands.availabilities.bikes}</p>
          </div>
        </div>
        <img src={rightArrow} alt="Flèche" className="h-6" />
        <div className="flex flex-col">
          <p className="text-xs">{endStation.name}</p>
          <div className="flex flex-row items-center justify-center gap-1">
            <img src={markerIcon} alt="Place" className="h-4 w-4" />
            <p className="text-xl font-bold">{endStation.totalStands.availabilities.stands}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FavoriteJourney
