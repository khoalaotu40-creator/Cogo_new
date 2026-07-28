export interface Location {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export const api = {
  auth: {
    login: async (phone: string) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone })
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return response.json();
    },
    clearData: async () => {
      const response = await fetch('/api/auth/clear', {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Clear data failed');
      }
      return response.json();
    }
  },
  rides: {
    create: async (userId: string, pickupLocation: Location, dropoffLocation: Location) => {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, pickupLocation, dropoffLocation })
      });
      if (!response.ok) {
        throw new Error('Failed to create ride');
      }
      return response.json();
    },
    getByUserId: async (userId: string) => {
      const response = await fetch(`/api/rides/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rides');
      }
      return response.json();
    }
  },
  locations: {
    /**
     * Lấy địa chỉ từ tọa độ (Reverse Geocoding)
     * GET /api/locations/reverse?lat=...&lng=...
     */
    reverse: async (lat: number, lng: number): Promise<Location> => {
      const response = await fetch(`/api/locations/reverse?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        throw new Error('Failed to reverse geocode location');
      }
      return response.json();
    },
    
    /**
     * Lấy gợi ý địa điểm từ từ khóa tìm kiếm
     * GET /api/locations/suggest?q=query
     */
    suggest: async (query: string): Promise<Location[]> => {
      const response = await fetch(`/api/locations/suggest?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }
      return response.json();
    }
  }
};
