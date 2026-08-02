import re

with open('lib/api.ts', 'r') as f:
    content = f.read()

old_create = """    create: async (userId: string, pickupLocation: Location, dropoffLocation: Location, typeRide: string) => {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, pickupLocation, dropoffLocation, typeRide })
      });
      if (!response.ok) {
        throw new Error(`Failed to create ride: ${response.status}`);
      }
      return response.json();
    },"""

new_create = """    create: async (userId: string, pickupLocation: Location, dropoffLocation: Location, typeRide: string) => {
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
    },"""

content = content.replace(old_create, new_create)

with open('lib/api.ts', 'w') as f:
    f.write(content)
