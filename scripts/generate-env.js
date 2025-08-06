const fs = require('fs');
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

fs.writeFileSync('./src/environments/environment.ts', dev);
fs.writeFileSync('./src/environments/environment.prod.ts', prod);
console.log('Generated Angular environment files from Netlify env vars');