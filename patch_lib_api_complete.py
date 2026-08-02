with open('lib/api.ts', 'r') as f:
    content = f.read()

complete_method = """    complete: async (rideId: string) => {
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
"""

if "complete: async" not in content:
    content = content.replace("getByUserId: async", complete_method + "    getByUserId: async")
    with open('lib/api.ts', 'w') as f:
        f.write(content)
