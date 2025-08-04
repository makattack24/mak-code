import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RocketLeagueService {
	constructor(private http: HttpClient) {}

	getStats(platform: string, username: string) {
		return this.http.get<any>('/.netlify/functions/rocket', {
			params: { platform, username },
		});
	}
}
