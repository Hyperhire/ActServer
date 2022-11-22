module.exports = {
  apps: [{
    name: "backend",
    script: 'npm',
    args: "run start",
    env_development: {
      NODE_ENV: "development"
    },
    error_file: '../error.log',
    out_file: '../out.log',
    merge_logs: true,
    instances: '1',
    exec_mode: 'cluster',
  }]
};
