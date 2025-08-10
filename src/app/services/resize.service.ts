import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResizeService {
	private resizeSubject = new Subject<void>();
	resize$ = this.resizeSubject.asObservable();

	triggerResize() {
		// console.log('Resize triggered');
		this.resizeSubject.next();
	}
}
