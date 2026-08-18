const fs = require('fs');
const content = fs.readFileSync('server/api/rides.ts', 'utf8');
const newContent = content.replace(
  /JOIN vehicles v ON r.id_vehicle = v.id_vehicle\s+JOIN users driver ON v.id_user = driver.id_user\s+JOIN users passenger ON r.id_user = passenger.id_user/,
  \`LEFT JOIN vehicles v ON r.id_vehicle = v.id_vehicle
      LEFT JOIN users driver ON v.id_user = driver.id_user
      LEFT JOIN users passenger ON r.id_user = passenger.id_user\`
);
fs.writeFileSync('server/api/rides.ts', newContent);
