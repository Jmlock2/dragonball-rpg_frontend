import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
// import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
// import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonicModule],
})
export class AppComponent {
  public appPages = [
    { title: 'Start', url: 'rpg', icon: 'grid' },
    { title: 'Characters', url: 'select-character', icon: 'grid' },
  ];
  constructor() {
    addIcons(icons);
  }
}
