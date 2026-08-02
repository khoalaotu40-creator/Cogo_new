export interface Ride {
  id_ride: string;
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
  phone: string;
  user_location: {
    lat: number;
    lng: number;
    name?: string;
    address?: string;
  };
  vehicle_location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}
