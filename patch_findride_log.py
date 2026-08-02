import re

with open('src/components/ride/FindRideForm.tsx', 'r') as f:
    content = f.read()

old_catch = """            } catch (err) {
                console.warn('Status poll warning:', err);
                // continue polling
            }"""

new_catch = """            } catch (err: any) {
                console.warn(`[FindRideForm] Status poll warning for ride ${rideId}:`, err.message || err);
                // continue polling
            }"""

content = content.replace(old_catch, new_catch)

with open('src/components/ride/FindRideForm.tsx', 'w') as f:
    f.write(content)
