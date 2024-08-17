import type { Station } from '~types/station';

const FAVORITE_STATION_KEY = 'bql-fav-station';
const FAVORITE_STATIONS_KEY = 'bql-fav-stations';
const SHOW_BIKE_COUNT_KEY = "bql-show-number"

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
    return showBikeCount ? Boolean(showBikeCount) : false;
  }
}

export default new StorageService();
