import type { Station } from '~types/station';





const FAVORITE_STATION_KEY = 'bql-fav-station';
const FAVORITE_STATIONS_KEY = 'bql-fav-stations';
const SHOW_BIKE_COUNT_KEY = "bql-show-number";
const REFRESH_INTERVAL_KEY = "bql-refresh-interval";
const SHOW_FAVORITE_JOURNEY_KEY = "bql-display-favorite-journee";
const FAVORITE_JOURNEY_START_STATION_KEY = "bql-beg-station";
const FAVORITE_JOURNEY_END_STATION_KEY = "bql-end-station";

const DEFAULT_REFRESH_INTERVAL = 10;

class StorageService {
  addFavoriteStation(station: Station) {
    const favoriteStations = JSON.parse(localStorage.getItem(FAVORITE_STATIONS_KEY)) as Station['number'][];
    if (!favoriteStations) {
      localStorage.setItem(FAVORITE_STATIONS_KEY, JSON.stringify([station.number]));
      return;
    } else if (favoriteStations.includes(station.number)) {
      return;
    }
    const updatedFavoriteStations = [...favoriteStations, station.number];
    localStorage.setItem(FAVORITE_STATIONS_KEY, JSON.stringify(updatedFavoriteStations));
  }

  getFavoriteStations(): Station['number'][] {
    const favoriteStations = JSON.parse(localStorage.getItem(FAVORITE_STATIONS_KEY)) as Station['number'][];
    return favoriteStations || [];
  }

  setFavoriteStation(stationNumber: Station['number'] | undefined) {
    localStorage.setItem(FAVORITE_STATION_KEY, stationNumber ? String(stationNumber) : undefined);
  }

  getFavoriteStation(): number | undefined {
    const favoriteStation = localStorage.getItem(FAVORITE_STATION_KEY);
    return favoriteStation ? Number(favoriteStation) : undefined;
  }

  setShowBikeCount(showBikeCount: boolean) {
    localStorage.setItem(SHOW_BIKE_COUNT_KEY, String(showBikeCount));
  }

  getShowBikeCount(): boolean {
    const showBikeCount = localStorage.getItem(SHOW_BIKE_COUNT_KEY);
    return showBikeCount !== null ? showBikeCount === 'true' ? true : false : false;
  }

  setRefreshInterval(refreshDelay: number) {
    if (refreshDelay < 1) {
      localStorage.setItem(REFRESH_INTERVAL_KEY, String(DEFAULT_REFRESH_INTERVAL))
      return;
    }
    localStorage.setItem(REFRESH_INTERVAL_KEY, String(refreshDelay));
  }

  getRefreshInterval(): number {
    const refreshDelay = localStorage.getItem(REFRESH_INTERVAL_KEY);
    return refreshDelay ? Number(refreshDelay) : DEFAULT_REFRESH_INTERVAL;
  }

  setShowFavoriteJourney(showFavoriteJourney: boolean) {
    localStorage.setItem(SHOW_FAVORITE_JOURNEY_KEY, String(showFavoriteJourney));
  }

  getShowFavoriteJourney(): boolean {
    const showFavoriteJourney = localStorage.getItem(SHOW_FAVORITE_JOURNEY_KEY);
    return showFavoriteJourney !== null ? showFavoriteJourney === 'true' ? true : false : false;
  }

  setFavoriteJourneyStations(startStationNumber: Station['number'], endStationNumber: Station['number']) {
    localStorage.setItem(FAVORITE_JOURNEY_START_STATION_KEY, String(startStationNumber));
    localStorage.setItem(FAVORITE_JOURNEY_END_STATION_KEY, String(endStationNumber));
  }

  getFavoriteJourneyStations(): [Station['number'], Station['number']] {
    const startStationNumber = localStorage.getItem(FAVORITE_JOURNEY_START_STATION_KEY);
    const endStationNumber = localStorage.getItem(FAVORITE_JOURNEY_END_STATION_KEY);
    return [startStationNumber ? Number(startStationNumber) : undefined, endStationNumber ? Number(endStationNumber) : undefined];
  }
}

export default new StorageService();
