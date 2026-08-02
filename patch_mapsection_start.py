import re

with open('src/components/driver/MapSection.tsx', 'r') as f:
    content = f.read()

old_logic1 = """          if (acceptedRideData.status === 'Arriving') {
            startLng = acceptedRideData.vehicle_location.longitude;
            startLat = acceptedRideData.vehicle_location.latitude;
            endLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
            endLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
          } else {
            // In Progress
            startLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
            startLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
            endLng = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lng : acceptedRideData.user_location.lng;
            endLat = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lat : acceptedRideData.user_location.lat;
          }"""
          
new_logic1 = """          startLng = acceptedRideData.vehicle_location.longitude;
          startLat = acceptedRideData.vehicle_location.latitude;

          if (acceptedRideData.status === 'Arriving') {
            endLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
            endLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
          } else {
            // In Progress
            endLng = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lng : acceptedRideData.user_location.lng;
            endLat = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lat : acceptedRideData.user_location.lat;
          }"""
          
content = content.replace(old_logic1, new_logic1)

old_logic2 = """            if (acceptedRideData.status === 'Arriving') {
              startLng = acceptedRideData.vehicle_location.longitude;
              startLat = acceptedRideData.vehicle_location.latitude;
              endLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
              endLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
            } else {
              startLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
              startLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
              endLng = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lng : acceptedRideData.user_location.lng;
              endLat = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lat : acceptedRideData.user_location.lat;
            }"""
            
new_logic2 = """            startLng = acceptedRideData.vehicle_location.longitude;
            startLat = acceptedRideData.vehicle_location.latitude;

            if (acceptedRideData.status === 'Arriving') {
              endLng = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lng : acceptedRideData.user_location.lng;
              endLat = acceptedRideData.Diem_don ? acceptedRideData.Diem_don.lat : acceptedRideData.user_location.lat;
            } else {
              endLng = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lng : acceptedRideData.user_location.lng;
              endLat = acceptedRideData.Diem_den ? acceptedRideData.Diem_den.lat : acceptedRideData.user_location.lat;
            }"""
            
content = content.replace(old_logic2, new_logic2)

with open('src/components/driver/MapSection.tsx', 'w') as f:
    f.write(content)

