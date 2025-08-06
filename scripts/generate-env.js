const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '../src/environments');

// Ensure the environments directory exists
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const dev = `
export const environment = {
  production: false,
  auth0: {
    domain: '${process.env.AUTH0_DOMAIN || ''}',
    clientId: '${process.env.AUTH0_CLIENT_ID || ''}',
    audience: '${process.env.AUTH0_AUDIENCE || ''}'
  }
};
`;
const prod = `
export const environment = {
  production: true,
  auth0: {
    domain: '${process.env.AUTH0_DOMAIN || ''}',
    clientId: '${process.env.AUTH0_CLIENT_ID || ''}',
    audience: '${process.env.AUTH0_AUDIENCE || ''}'
  }
};
`;

fs.writeFileSync(path.join(envDir, 'environment.ts'), dev);
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), prod);
console.log('Generated Angular environment files from Netlify env vars');