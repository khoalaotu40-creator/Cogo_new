with open('lib/api.ts', 'r') as f:
    content = f.read()

get_status = """
    getStatus: async (rideId: string) => {
      const response = await fetch(`/api/rides/status/${rideId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ride status: ${response.status}`);
      }
      return response.json();
    },
"""
content = content.replace("getByUserId: async", get_status + "\n    getByUserId: async")

with open('lib/api.ts', 'w') as f:
    f.write(content)
