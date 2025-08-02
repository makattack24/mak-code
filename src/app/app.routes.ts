import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AppsComponent } from './apps/apps.component';
import { CalculatorComponent } from './apps/calculator/calculator.component';
import { ClockComponent } from './apps/clock/clock.component';
import { GameComponent } from './apps/game/game.component';
import { GraphicsgameComponent } from './apps/graphicsgame/graphicsgame.component';
import { SoundComponent } from './apps/sound/sound.component';
import { EditorComponent } from './apps/editor/editor.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'apps', component: AppsComponent, children: [
            { path: 'calculator', component: CalculatorComponent },
            { path: 'clock', component: ClockComponent },
            { path: 'game', component: GameComponent },
            { path: 'sim', component: GraphicsgameComponent },
            { path: 'sound', component: SoundComponent },
            { path: 'editor', component: EditorComponent },

            // Add more project routes here as needed
        ]
    },
    { path: 'admin', component: AdminComponent },
    { path: '**', redirectTo: '' } // Redirect any unknown paths to home
];