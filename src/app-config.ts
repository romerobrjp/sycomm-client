export interface ApplicationConfig {
  appName: string;
  appVersion: string;
  apiBaseUrl: string;
}

export const APP_CONFIG: ApplicationConfig = {
  appName: 'Sycomm',
  appVersion: '1.0.0',
  apiBaseUrl: 'https://sycomm-api.herokuapp.com',
};
