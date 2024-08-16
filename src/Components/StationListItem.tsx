import type { Station } from "~types/station"

type StationListItemProps = {
  station: Station
}

const StationListItem = ({ station }: StationListItemProps) => {
  const stationName = station.name.replace("-", " - ")

  return (
    <div
      role="button"
      className="group flex flex-row justify-between border-b-2 border-gray-200 py-1 cursor-pointer hover:bg-orange-500 rounded"
      onClick={() => {}}>
      <p className="text-sm font-bold text-orange-500 group-hover:translate-x-2 group-hover:text-white transition-transform">{stationName}</p>
      <span className="group-hover:text-white mr-1">
        🚲 {station.totalStands.availabilities.bikes} 📍 {station.totalStands.availabilities.stands}
      </span>
    </div>
  )
}

export default StationListItem
