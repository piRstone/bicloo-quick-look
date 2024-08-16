import type { Station } from "~types/station"

type StationProps = {
  station: Station
}

const StationItem = ({ station }: StationProps) => {
  const stationName = station.name.replace("-", " - ")
  const bikeCount = station.totalStands.availabilities.bikes
  const standCount = station.totalStands.availabilities.stands

  const getAvailabilityColor = (count: number) => {
    if (count === 0) {
      return "bg-red-600"
    }
    if (count < 3) {
      return "bg-orange-400"
    }
    return "bg-green-700"
  }

  return (
    <div className="flex flex-col bg-white px-3 pt-2 pb-3 rounded-md shadow-md">
      <div className="flex flex-row items-center gap-1 my-1">
        <p className="text-lg font-bold text-gray-800 tracking-wider">{station.name}</p>
        <span className="text-gray-500">- {station.number}</span>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${getAvailabilityColor(bikeCount)}`}></div>
        <p className="text-sm text-gray-700">
          {bikeCount === 0
            ? "Aucun vélo disponible"
            : `${bikeCount} ${bikeCount > 1 ? "vélos disponibles" : "vélo disponible"}`}
        </p>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${getAvailabilityColor(standCount)}`}></div>
        <p className="text-sm text-gray-700">
          {standCount === 0
            ? "Aucune place disponible"
            : `${standCount} ${standCount > 1 ? "places disponibles" : "place disponible"}`}
        </p>
      </div>
    </div>
  )
}

export default StationItem
