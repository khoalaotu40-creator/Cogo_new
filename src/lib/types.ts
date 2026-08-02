export type RideStatus = 'upcoming' | 'completed' | 'cancelled';

export type VehicleType = 'Bất kỳ' | 'Xe máy' | 'Ô tô';

export type RepeatType = 'Một lần' | 'Thứ 2 - 6' | 'Hàng ngày';

export type Location = {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
};

export type User = {
  id: string;
  phone: number;
};

export type Ride = {
  id: string;
  driverId: string;
  departure: Location;
  destination: Location;
  departureTime: Date;
  vehicleType: VehicleType;
  availableSeats: number;
  pricePerSeat?: number;
  status: RideStatus;
  repeat?: RepeatType;
  detourAcceptance?: number; // Mức chấp nhận đi vòng (%)
};
