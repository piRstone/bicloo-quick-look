import { getStations } from "~services/api/stations"
import StorageService from "~services/storage"

const ALARM_NAME = "bql-alarm"

const action = process.env.PLASMO_MANIFEST_VERSION === "mv3" ? chrome.action : chrome.browserAction

async function getFavoriteStationBikesCount() {
  const showBikesCount = await StorageService.getShowBikeCount()
  if (!showBikesCount) return

  const stations = await getStations()
  const favoriteStationNumber = await StorageService.getFavoriteStation()
  const favoriteStation = stations.find((station) => station.number === favoriteStationNumber)
  const availableBikes = favoriteStation?.totalStands.availabilities.bikes

  // Set badge text
  action.setBadgeText({ text: availableBikes.toString() })
  action.setBadgeBackgroundColor({
    color: favoriteStation?.totalStands.availabilities.bikes > 0 ? "green" : "red"
  })
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    console.log("alarm!!!")
    getFavoriteStationBikesCount()
  }
})

chrome.runtime.onInstalled.addListener(async () => {
  chrome.alarms.clear(ALARM_NAME)
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: 4
  })
})

getFavoriteStationBikesCount()
