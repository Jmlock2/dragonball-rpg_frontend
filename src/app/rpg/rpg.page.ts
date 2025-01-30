import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rpg',
  templateUrl: './rpg.page.html',
  styleUrls: ['./rpg.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RpgPage implements OnInit {

  constructor(private router: Router) { }

  redirigir() {
    this.router.navigate(['\select-character']); // Te envia al selector de personajes
  }

  ngOnInit() {
  }

}
