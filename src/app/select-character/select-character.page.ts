// import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-select-character',
  templateUrl: './select-character.page.html',
  styleUrls: ['./select-character.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SelectCharacterPage {

  // Lista de personajes
  public characters = [
    { name: 'Goku', sprite: '/assets/icon/selector/GokuSL1.png' },
    { name: 'Vegeta', sprite: '/assets/icon/selector/VegetaSL2.png' },
    { name: 'Trunks', sprite: '/assets/icon/selector/TrunksSL3.png' },
    { name: 'Piccolo', sprite: '/assets/icon/selector/PiccoloSL4.png' },
    { name: 'Freezer', sprite: '/assets/icon/selector/FreezerSL5.png' },
    { name: 'Cell', sprite: '/assets/icon/selector/CellSL6.png' },
    { name: 'Majin Buu', sprite: '/assets/icon/selector/BuuSL7.png' },
    { name: 'Broly', sprite: '/assets/icon/selector/BrolySL8.png' }
  ];

  // Índice del personaje actual
  public currentIndex: number = 0;

  get currentCharacter() {
    return this.characters[this.currentIndex];
  }

  constructor(private router: Router) { }

  // Cambiar al personaje anterior
  previousCharacter() {
    this.currentIndex =
      (this.currentIndex - 1 + this.characters.length) % this.characters.length;
  }

  // Cambiar al personaje siguiente
  nextCharacter() {
    this.currentIndex = (this.currentIndex + 1) % this.characters.length;
  }

  // Volver al menu principal (Falta crear el botón en HTML)
  goToMainMenu() {
    console.log('Volviendo a menu principal...')
    this.router.navigate(['rpg']); // Nos aseguramos de que esta ruta este configurada correctamente
  }

  // Confirmar selección de personaje
  selectCharacter() {
    console.log('Personaje seleccionado', this.currentCharacter.name);
    // Guardar la selección o realizar una acción, por ejemplo: this.selectedCharacter = this.currentCharacter;
    alert(`Has seleccionado a ${this.currentCharacter.name}`)
  }

  ngOnInit() {
  }

}
