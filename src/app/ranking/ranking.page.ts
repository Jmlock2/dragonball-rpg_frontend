import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonItem, IonLabel, IonCol, IonRow, IonGrid, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Router } from '@angular/router'; // Importa Router para la redirección

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonGrid, IonRow, IonCol, IonContent, CommonModule, FormsModule]
})
export class RankingPage implements OnInit {

  public ranking: any[] = [];

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.obtenerRanking();
  }

  obtenerRanking(): void {
    console.log('Haciendo petición GET a:', 'https://dragonball-rpg-backend.onrender.com/ranking');
    this.http.get('https://dragonball-rpg-backend.onrender.com/ranking').subscribe({
      next: (data: any) => {
        this.ranking = data;
        console.log('Ranking obtenido:', this.ranking);
      },
      error: (error) => {
        console.error("❌ Error al obtener ranking:", error);
      }
    });
  }

  irARpg() {
    this.router.navigate(['/rpg']);
  }
}