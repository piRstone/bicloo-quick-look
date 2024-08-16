import type { Station } from '~types/station';

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

  getFavoriteStations() {
    console.log('getFavoriteStations');
    const favoriteStations = JSON.parse(localStorage.getItem(FAVORITE_STATIONS_KEY)) as Station['number'][];
    return favoriteStations || [];
  }
}

export default new StorageService();
