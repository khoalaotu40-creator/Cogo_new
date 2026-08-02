import re

with open('src/components/ride/FindRideForm.tsx', 'r') as f:
    content = f.read()

old_loop = """        let isAccepted = false;
        while (!isAccepted) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const statusRes = await api.rides.getStatus(rideId);
            if (statusRes.id_vehicle !== null) {
                isAccepted = true;
            }
        }"""

new_loop = """        let isAccepted = false;
        while (!isAccepted) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            try {
                const statusRes = await api.rides.getStatus(rideId);
                if (statusRes && statusRes.id_vehicle !== null) {
                    isAccepted = true;
                }
            } catch (err) {
                console.warn('Status poll warning:', err);
                // continue polling
            }
        }"""

content = content.replace(old_loop, new_loop)

with open('src/components/ride/FindRideForm.tsx', 'w') as f:
    f.write(content)
