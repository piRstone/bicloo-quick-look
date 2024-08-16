import { Station, StationResponse } from '../types/station';
import apiClient from './client';

const mapStationResponseToStation = (stationResponse: StationResponse): Station => ({
  number: stationResponse.number,
  name: stationResponse.name,
  address: stationResponse.address,
  position: stationResponse.position,
  status: stationResponse.status,
  lastUpdate: new Date(stationResponse.lastUpdate),
  connected: stationResponse.connected,
  totalStands: stationResponse.totalStands,
  mainStands: stationResponse.mainStands,
  overflowStands: stationResponse.overflowStands,
})

export async function getStations(): Promise<Station[]> {
  const response = await apiClient.get<StationResponse[]>('/stations');
  console.log('response', response);
  return response.map(station => mapStationResponseToStation(station));
}

export async function getStationById(id: number): Promise<Station> {
  const response = await apiClient.get<StationResponse>(`/stations/${id}`);
  return mapStationResponseToStation(response);
}
