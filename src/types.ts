export interface Ride {
  id_ride: string;
  status: string;
  phone: string;
  location: {
    address: string;
    name: string;
    lat: number;
    lng: number;
  };
}

export interface AcceptedRideData {
  id_ride: string;
  status: string;
  phone: string;
  user_location: {
    lat: number;
    lng: number;
    name?: string;
    address?: string;
  };
  
  Diem_don?: any;
  Diem_den?: any;
  passengers_pickups?: any[];

  vehicle_location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}
