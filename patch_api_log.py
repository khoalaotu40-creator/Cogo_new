import re

with open('lib/api.ts', 'r') as f:
    content = f.read()

old_status = """    getStatus: async (rideId: string) => {
      const response = await fetch(`/api/rides/status/${rideId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ride status: ${response.status}`);
      }
      return response.json();
    },"""

new_status = """    getStatus: async (rideId: string) => {
      const response = await fetch(`/api/rides/status/${rideId}`);
      if (!response.ok) {
        let errorText = '';
        try { errorText = await response.text(); } catch (e) {}
        console.error(`[API] getStatus(${rideId}) failed with status ${response.status}:`, errorText);
        throw new Error(`Failed to fetch ride status: ${response.status}. Details: ${errorText}`);
      }
      return response.json();
    },"""

content = content.replace(old_status, new_status)

with open('lib/api.ts', 'w') as f:
    f.write(content)
