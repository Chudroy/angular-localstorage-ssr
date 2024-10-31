import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { LOCAL_STORAGE } from './tokens';

/* eslint-disable @typescript-eslint/no-empty-function */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: LOCAL_STORAGE,
      useFactory: () => ({
        getItem: () => {},
        setItem: () => {},
        removeItem: () => {},
      }),
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
