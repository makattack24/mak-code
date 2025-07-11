import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectsComponent } from './projects/projects.component';
import { CalculatorComponent } from './projects/calculator/calculator.component';
import { ClockComponent } from './projects/clock/clock.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    {
        path: 'projects', component: ProjectsComponent, children: [
            { path: 'calculator', component: CalculatorComponent },
            { path: 'clock', component: ClockComponent },
            // Add more project routes here as needed
        ]
    },
    { path: '**', redirectTo: '' } // Redirect any unknown paths to home
];