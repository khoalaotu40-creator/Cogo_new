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
    register: async (phone: string, name: string, intro_text?: string) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, name, intro_text })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Register failed');
      }
      return response.json();
    }
  },
  rides: {
    create: async (userId: string, pickupLocation: Location, dropoffLocation: Location, typeRide: string) => {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, pickupLocation, dropoffLocation, typeRide })
      });
      if (!response.ok) {
        let errorText = '';
        try { errorText = await response.text(); } catch (e) {}
        console.error(`[API] create ride failed with status ${response.status}:`, errorText);
        throw new Error(`Failed to create ride: ${response.status}. Details: ${errorText}`);
      }
      return response.json();
    },
    getAvailable: async () => {
      const response = await fetch('/api/rides/available');
      if (!response.ok) {
        throw new Error(`Failed to fetch available rides: ${response.status}`);
      }
      return response.json();
    },
    
        getTracking: async (rideId: string) => {
      const response = await fetch(`/api/rides/tracking/${rideId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tracking info: ${response.status}`);
      }
      return response.json();
    },
    getStatus: async (rideId: string) => {
      const response = await fetch(`/api/rides/status/${rideId}`);
      if (!response.ok) {
        let errorText = '';
        try { errorText = await response.text(); } catch (e) {}
        console.error(`[API] getStatus(${rideId}) failed with status ${response.status}:`, errorText);
        throw new Error(`Failed to fetch ride status: ${response.status}. Details: ${errorText}`);
      }
      return response.json();
    },

            pickup: async (rideId: string) => {
      const response = await fetch('/api/rides/pickup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_ride: rideId })
      });
      if (!response.ok) {
        throw new Error(`Failed to pickup: ${response.status}`);
      }
      return response.json();
    },
    complete: async (rideId: string) => {
      const response = await fetch('/api/rides/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_ride: rideId })
      });
      if (!response.ok) {
        throw new Error(`Failed to complete ride: ${response.status}`);
      }
      return response.json();
    },
    getByUserId: async (userId: string) => {
      const response = await fetch(`/api/rides/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch rides: ${response.status}`);
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
  },
  posts: {
    getAll: async () => {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }
      return response.json();
    },
    delete: async (id: number) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`);
      }
      return response.json();
    },
    create: async (data: { user_id: number; content: string; departure_point?: string; destination_point?: string; pickup_location?: any; dropoff_location?: any; media_url?: string; ride_frequency?: string; privacy?: string }) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`);
      }
      return response.json();
    },
    join: async (postId: number, data: { user_id: string; message: string; requested_seats: number; pickup_point: any; dropoff_point: any }) => {
      const response = await fetch(`/api/posts/${postId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Failed to join post: ${response.status}`);
      }
      return response.json();
    },
    getUserRequests: async (userId: string) => {
      const response = await fetch(`/api/posts/requests/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user requests: ${response.status}`);
      }
      return response.json();
    },
    getNotifications: async (userId: string) => {
      const response = await fetch(`/api/posts/notifications/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
      return response.json();
    },
    respondToRequest: async (requestId: number, status: 'accepted' | 'rejected') => {
      const response = await fetch(`/api/posts/requests/${requestId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        throw new Error(`Failed to respond to request: ${response.status}`);
      }
      return response.json();
    }
  },
  users: {
    update: async (userId: string, data: { avatar_url?: string; background_url?: string; driver_id?: number }) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }
      return response.json();
    }
  }
};
