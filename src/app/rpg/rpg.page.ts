import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';
import { IonGrid, IonRow, IonCol, IonButton, IonContent, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-rpg',
  templateUrl: './rpg.page.html',
  styleUrls: ['./rpg.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonButton, IonContent, IonImg, CommonModule, FormsModule]
})
export class RpgPage implements OnInit {

  constructor(private router: Router, private auth: AuthService) { }

  redirigir() {
    this.router.navigate(['\select-character']); // Te envia al selector de personajes
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } }); // 🔹 Para cerrar sesión, redirige a la página de login.
  }

  ngOnInit() {
  }

}
