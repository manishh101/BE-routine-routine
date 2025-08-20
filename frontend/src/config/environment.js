// Environment configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:7102',
    APP_NAME: 'BE Routine Management System (Dev)',
    NODE_ENV: 'development'
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.onrender.com',
    APP_NAME: import.meta.env.VITE_APP_NAME || 'BE Routine Management System',
    NODE_ENV: 'production'
  }
};

const environment = import.meta.env.MODE || 'development';
const currentConfig = config[environment] || config.development;

export default currentConfig;
