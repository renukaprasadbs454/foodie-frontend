const path = require('path');
const https = require('https');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const sharedRnRoot = path.resolve(workspaceRoot, 'packages/shared-rn');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Allow Metro to follow pnpm symlinks hierarchically
config.resolver.disableHierarchicalLookup = false;

const reactNativeWebPath = path.dirname(
  require.resolve('react-native-web/package.json', { paths: [projectRoot, workspaceRoot] })
);

// 4. Resolve shared-rn and web aliases
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'foodie-shared-rn') {
    return context.resolveRequest(context, path.resolve(sharedRnRoot, 'src/index.ts'), platform);
  }

  if (platform === 'web') {
    if (moduleName === 'react-native' || moduleName.startsWith('react-native/')) {
      return {
        type: 'sourceFile',
        filePath: path.resolve(reactNativeWebPath, 'dist/index.js'),
      };
    }
    if (moduleName === 'react-native-maps') {
      return context.resolveRequest(context, '@teovilla/react-native-web-maps', platform);
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

const http = require('http');

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url && req.url.startsWith('/api/')) {
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'access-control-allow-origin': '*',
            'access-control-allow-headers': '*',
            'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'access-control-allow-credentials': 'true',
            'access-control-max-age': '86400',
          });
          res.end();
          return;
        }

        const backendHost = 'localhost';
        const backendPort = 8082;
        const options = {
          hostname: backendHost,
          port: backendPort,
          path: req.url,
          method: req.method,
          headers: {
            ...req.headers,
            host: `${backendHost}:${backendPort}`,
          },
        };

        const proxyReq = http.request(options, (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 200, {
            ...proxyRes.headers,
            'access-control-allow-origin': '*',
            'access-control-allow-headers': '*',
            'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          });
          proxyRes.pipe(res, { end: true });
        });

        proxyReq.on('error', (err) => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: { code: 'BAD_GATEWAY', message: err.message } }));
        });

        req.pipe(proxyReq, { end: true });
        return;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
