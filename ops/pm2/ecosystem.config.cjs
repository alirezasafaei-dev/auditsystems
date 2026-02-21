module.exports = {
  apps: [
    {
      name: 'asdev-audit-web',
      cwd: '/home/dev/Project_Me/asdev-audit-ir',
      script: 'pnpm',
      args: 'exec next start -p 3000',
      env: {
        NODE_ENV: 'production'
      },
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'asdev-audit-worker',
      cwd: '/home/dev/Project_Me/asdev-audit-ir',
      script: 'pnpm',
      args: 'run worker:dev',
      env: {
        NODE_ENV: 'production'
      },
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
