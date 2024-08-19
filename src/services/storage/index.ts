import { Storage } from "@plasmohq/storage";



import type { Station } from "~types/station";





const HAS_MIGRATED_KEY = "bql-has-migrated"
const FAVORITE_STATION_KEY = "bql-fav-station"
const FAVORITE_STATIONS_KEY = "bql-fav-stations"
const SHOW_BIKE_COUNT_KEY = "bql-show-number"
const REFRESH_INTERVAL_KEY = "bql-refresh-interval"
const SHOW_FAVORITE_JOURNEY_KEY = "bql-display-favorite-journee"
const FAVORITE_JOURNEY_START_STATION_KEY = "bql-beg-station"
const FAVORITE_JOURNEY_END_STATION_KEY = "bql-end-station"

const DEFAULT_REFRESH_INTERVAL = 10

class StorageService {
  storage: Storage

  constructor() {
    this.storage = new Storage()

    // Migrate from localStorage to storage
    this.migrateFromLocalStorageToStorage()
  }

  async addFavoriteStation(station: Station) {
    const favoriteStations = await this.getFavoriteStations()
    if (!favoriteStations) {
      await this.storage.set(FAVORITE_STATIONS_KEY, JSON.stringify([station.number]))
      return
    } else if (favoriteStations.includes(station.number)) {
      return
    }
    const updatedFavoriteStations = [...favoriteStations, station.number]
    await this.storage.set(FAVORITE_STATIONS_KEY, JSON.stringify(updatedFavoriteStations))
  }

  async getFavoriteStations(): Promise<Station["number"][]> {
    const favoriteStations = (await this.storage.get(FAVORITE_STATIONS_KEY)) as Station["number"][]
    return favoriteStations || []
  }

  async setFavoriteStation(stationNumber: Station["number"] | undefined) {
    await this.storage.set(FAVORITE_STATION_KEY, stationNumber ? String(stationNumber) : undefined)
  }

  async getFavoriteStation(): Promise<number | undefined> {
    const favoriteStation = await this.storage.get(FAVORITE_STATION_KEY)
    return favoriteStation ? Number(favoriteStation) : undefined
  }

  async setShowBikeCount(showBikeCount: boolean) {
    await this.storage.set(SHOW_BIKE_COUNT_KEY, showBikeCount)
  }

  async getShowBikeCount(): Promise<boolean> {
    const showBikeCount = await this.storage.get(SHOW_BIKE_COUNT_KEY)
    return showBikeCount !== undefined ? Boolean(showBikeCount) : false
  }

  async setRefreshInterval(refreshDelay: number) {
    if (refreshDelay < 1) {
      await this.storage.set(REFRESH_INTERVAL_KEY, String(DEFAULT_REFRESH_INTERVAL))
      return
    }
    await this.storage.set(REFRESH_INTERVAL_KEY, String(refreshDelay))
  }

  async getRefreshInterval(): Promise<number> {
    const refreshDelay = await this.storage.get(REFRESH_INTERVAL_KEY)
    return refreshDelay ? Number(refreshDelay) : DEFAULT_REFRESH_INTERVAL
  }

  async setShowFavoriteJourney(showFavoriteJourney: boolean) {
    await this.storage.set(SHOW_FAVORITE_JOURNEY_KEY, showFavoriteJourney)
  }

  async getShowFavoriteJourney(): Promise<boolean> {
    const showFavoriteJourney = await this.storage.get(SHOW_FAVORITE_JOURNEY_KEY)
    return showFavoriteJourney !== undefined ? Boolean(showFavoriteJourney): false
  }

  async setFavoriteJourneyStations(startStationNumber: Station["number"], endStationNumber: Station["number"]) {
    await this.storage.set(FAVORITE_JOURNEY_START_STATION_KEY, String(startStationNumber))
    await this.storage.set(FAVORITE_JOURNEY_END_STATION_KEY, String(endStationNumber))
  }

  async getFavoriteJourneyStations(): Promise<[Station["number"], Station["number"]]> {
    const startStationNumber = await this.storage.get(FAVORITE_JOURNEY_START_STATION_KEY)
    const endStationNumber = await this.storage.get(FAVORITE_JOURNEY_END_STATION_KEY)
    return [
      startStationNumber ? Number(startStationNumber) : undefined,
      endStationNumber ? Number(endStationNumber) : undefined
    ]
  }

  private async migrateFromLocalStorageToStorage() {
    const hasMigrated = await this.storage.get(HAS_MIGRATED_KEY)
    if (hasMigrated) return

    const favoriteStation = localStorage.getItem(FAVORITE_STATION_KEY)
    if (favoriteStation) {
      await this.storage.set(FAVORITE_STATION_KEY, favoriteStation)
      localStorage.removeItem(FAVORITE_STATION_KEY)
    }

    const favoriteStations = localStorage.getItem(FAVORITE_STATIONS_KEY)
    if (favoriteStations) {
      await this.storage.set(FAVORITE_STATIONS_KEY, favoriteStations)
      localStorage.removeItem(FAVORITE_STATIONS_KEY)
    }

    const showBikeCount = localStorage.getItem(SHOW_BIKE_COUNT_KEY)
    if (showBikeCount) {
      await this.storage.set(SHOW_BIKE_COUNT_KEY, showBikeCount === "true" ? true : false)
      localStorage.removeItem(SHOW_BIKE_COUNT_KEY)
    }

    const refreshInterval = localStorage.getItem(REFRESH_INTERVAL_KEY)
    if (refreshInterval) {
      await this.storage.set(REFRESH_INTERVAL_KEY, refreshInterval)
      localStorage.removeItem(REFRESH_INTERVAL_KEY)
    }

    const showFavoriteJourney = localStorage.getItem(SHOW_FAVORITE_JOURNEY_KEY)
    if (showFavoriteJourney) {
      await this.storage.set(SHOW_FAVORITE_JOURNEY_KEY, showFavoriteJourney === "true" ? true : false)
      localStorage.removeItem(SHOW_FAVORITE_JOURNEY_KEY)
    }

    const favoriteJourneyStartStation = localStorage.getItem(FAVORITE_JOURNEY_START_STATION_KEY)
    if (favoriteJourneyStartStation) {
      await this.storage.set(FAVORITE_JOURNEY_START_STATION_KEY, favoriteJourneyStartStation)
      localStorage.removeItem(FAVORITE_JOURNEY_START_STATION_KEY)
    }

    const favoriteJourneyEndStation = localStorage.getItem(FAVORITE_JOURNEY_END_STATION_KEY)
    if (favoriteJourneyEndStation) {
      await this.storage.set(FAVORITE_JOURNEY_END_STATION_KEY, favoriteJourneyEndStation)
      localStorage.removeItem(FAVORITE_JOURNEY_END_STATION_KEY)
    }

    await this.storage.set(HAS_MIGRATED_KEY, true)
  }
}

export default new StorageService()
