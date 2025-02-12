import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Router } from '@angular/router'; // Importa Router para la redirección

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [IonContent, IonList, IonItem, IonLabel, CommonModule, FormsModule]
})
export class RankingPage implements OnInit {

  public ranking: any[] = [];

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.obtenerRanking();
  }

  obtenerRanking() {
    this.http.get('http://localhost:3000/usuarios/ranking')
      .subscribe((data: any) => {
        this.ranking = data;
      }, error => {
        console.error('Error al obtener el ranking', error);

      });
  }

}