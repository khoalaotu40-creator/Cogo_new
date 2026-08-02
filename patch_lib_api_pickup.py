with open('lib/api.ts', 'r') as f:
    content = f.read()

pickup_method = """    pickup: async (rideId: string) => {
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
"""

if "pickup: async" not in content:
    content = content.replace("complete: async", pickup_method + "    complete: async")
    with open('lib/api.ts', 'w') as f:
        f.write(content)
