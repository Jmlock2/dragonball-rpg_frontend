import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
// import { IonicModule } from '@ionic/angular';
import {
  IonContent, IonHeader, IonToolbar, IonTitle,
  IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet,
  IonMenuButton, IonMenuToggle, IonListHeader
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonContent, IonHeader, IonToolbar, IonTitle, IonList, IonIcon, IonMenu, IonLabel, IonRouterOutlet, IonMenuToggle, IonListHeader],
})
export class AppComponent {
  public appPages = [
    { title: 'Login', url: 'login', icon: 'body' },
    { title: 'Start', url: 'rpg', icon: 'grid' },
    { title: 'Characters', url: 'select-character', icon: 'grid' },
    { title: 'Battle', url: 'battle', icon: 'body' },
    { title: 'Ranking', url: 'ranking', icon: 'body' },
  ];

  constructor() {
    addIcons(icons);
  }
}
