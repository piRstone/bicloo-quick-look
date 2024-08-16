import type { Station } from '~types/station';

const FAVORITE_STATION_KEY = 'bql-fav-station';
const FAVORITE_STATIONS_KEY = 'bql-fav-stations';

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
}

export default new StorageService();
