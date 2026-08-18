const fs = require('fs');
let content = fs.readFileSync('src/components/ride/PostBackgroundMap.tsx', 'utf8');

content = content.replace(
  "import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';",
  "import { MapContainer, TileLayer, Polyline, Rectangle, useMap } from 'react-leaflet';"
);

content = content.replace(
  "interface Props {",
  "interface Props {\n  isJoined?: boolean;"
);

content = content.replace(
  "export default function PostBackgroundMap({ pickupLocation, dropoffLocation }: Props) {",
  "export default function PostBackgroundMap({ pickupLocation, dropoffLocation, isJoined = false }: Props) {"
);

content = content.replace(
  "if (pickupLocation && dropoffLocation && pickupLocation.lat && dropoffLocation.lat) {",
  "if (pickupLocation && dropoffLocation && pickupLocation.lat && dropoffLocation.lat) {\n      if (isJoined) {\n        fetchRoute();\n      }\n    }"
);

content = content.replace(
  "if (routeCoordinates.length > 0) {",
  "const areaBounds = bounds.pad(0.3);\n  if (routeCoordinates.length > 0) {"
);

content = content.replace(
  /<ChangeView bounds=\{bounds\} \/>\s*\{routeCoordinates\.length > 0 && \(\s*<Polyline/g,
  `<ChangeView bounds={isJoined ? bounds : areaBounds} />
      {isJoined && routeCoordinates.length > 0 && (
        <Polyline`
);

content = content.replace(
  /<\/Polyline>\s*\)\}\s*<\/MapContainer>/,
  `</Polyline>
      )}
      {!isJoined && (
        <Rectangle 
          bounds={areaBounds} 
          color="#2ee6c2" 
          weight={2} 
          fillOpacity={0.15} 
          dashArray="8, 8" 
        />
      )}
    </MapContainer>`
);

fs.writeFileSync('src/components/ride/PostBackgroundMap.tsx', content);
