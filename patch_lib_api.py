with open('lib/api.ts', 'r') as f:
    content = f.read()

tracking_method = """    getTracking: async (rideId: string) => {
      const response = await fetch(`/api/rides/tracking/${rideId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tracking info: ${response.status}`);
      }
      return response.json();
    },
"""
if "getTracking:" not in content:
    content = content.replace("getStatus: async", tracking_method + "    getStatus: async")
    with open('lib/api.ts', 'w') as f:
        f.write(content)
