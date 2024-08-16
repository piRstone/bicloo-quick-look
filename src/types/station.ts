type Status = 'OPEN' | 'CLOSED';
type Position = {
  latitude: number;
  longitude: number;
};
type Availability = {
  bikes: number;
  stands: number;
  mechanicalBikes: number;
  electricalBikes: number;
  electricalInternalBatteryBikes: number;
  electricalRemovableBatteryBikes: number;
};
type Stands = {
  availabilities: Availability;
  capacity: number;
};

export type StationsResponse = StationResponse[];
export interface StationResponse {
  number: number;
  contractName: string;
  name: string;
  address: string;
  position: Position;
  banking: boolean;
  bonus: boolean;
  status: Status;
  lastUpdate: string;
  connected: boolean;
  overflow: boolean;
  shape: null;
  totalStands: Stands;
  mainStands: Stands;
  overflowStands: Stands;
}

export interface Station {
  number: number;
  name: string;
  address: string;
  position: Position;
  status: Status;
  lastUpdate: Date;
  connected: boolean;
  totalStands: Stands;
  mainStands: Stands;
  overflowStands: Stands;
}
