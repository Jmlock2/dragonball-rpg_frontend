// import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonGrid, IonRow, IonCol, IonButton, IonContent, IonImg, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-select-character',
  templateUrl: './select-character.page.html',
  styleUrls: ['./select-character.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonButton, IonContent, IonImg, IonIcon, CommonModule, FormsModule]
})
export class SelectCharacterPage {

  // Lista de personajes
  public characters = [
    { name: 'Goku', sprite: '/assets/icon/selector/GokuSL1.png' },
    { name: 'Vegeta', sprite: '/assets/icon/selector/VegetaSL2.png' },
    { name: 'Trunks', sprite: '/assets/icon/selector/TrunksSL3.png' },
    { name: 'Piccolo', sprite: '/assets/icon/selector/PiccoloSL4.png' },
    { name: 'Freezer', sprite: '/assets/icon/selector/FreezerSL5.png' },
  ];

  // Índice del personaje actual
  public currentIndex: number = 0;
  public currentCharacter = this.characters[this.currentIndex];

  constructor(private router: Router) { }

  // Cambiar al personaje anterior
  previousCharacter() {
    this.currentIndex =
      (this.currentIndex - 1 + this.characters.length) % this.characters.length;
    this.currentCharacter = this.characters[this.currentIndex];
  }

  // Cambiar al personaje siguiente
  nextCharacter() {
    this.currentIndex = (this.currentIndex + 1) % this.characters.length;
    this.currentCharacter = this.characters[this.currentIndex];
  }

  // Confirmar selección de personaje
  selectCharacter() {
    if (this.currentCharacter.name !== 'Goku') {
      alert('Solo puedes escoger a Son Goku')
      alert('Más personajes jugables en la próxima actualización')
    } else {
      localStorage.setItem('personaje', this.currentCharacter.name)
      localStorage.setItem('ronda', '0'); // Se inicia la primera batalla
      this.router.navigate(['/battle']);
    }
  }

  // Volver al menu principal (Falta crear el botón en HTML)
  goToMainMenu() {
    console.log('Volviendo a menu principal...')
    this.router.navigate(['rpg']); // Nos aseguramos de que esta ruta este configurada correctamente
  }

  ngOnInit() {
  }

}
