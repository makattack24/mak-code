import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideMarkdown } from 'ngx-markdown';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(),
		provideAnimationsAsync(),
		provideToastr({
			timeOut: 3000,
			positionClass: 'toast-top-right',
			preventDuplicates: true,
			progressBar: true,
		}),
		provideMarkdown(),
		provideAuth0({
			domain: environment.auth0.domain,
			clientId: environment.auth0.clientId,
			authorizationParams: {
				redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
				audience: environment.auth0.audience || undefined,
			},
		}),
	],
};
