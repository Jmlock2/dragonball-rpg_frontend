import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';
import { IonGrid, IonRow, IonCol, IonButton, IonContent, IonIcon, IonImg, IonProgressBar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.page.html',
  styleUrls: ['./battle.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonButton, IonContent, IonIcon, IonImg, IonProgressBar, CommonModule, FormsModule]
})
export class BattlePage implements OnInit {

  // Lista de batallas predefinidas
  public batallas = [
    { name: 'Piccolo', escenario: 'assets/icon/battle/stages/torneo.png', sprite: 'assets/icon/battle/pjs/piccolo_battle.gif', imagenGolpe: 'assets/icon/battle/hits/piccolo_hit.png', attack_hit: 'assets/icon/battle/attacks/piccolo_attack.png', defense: 'assets/icon/battle/defense/piccolo_defense.png' },
    { name: 'Vegeta', escenario: 'assets/icon/battle/stages/desierto.png', sprite: 'assets/icon/battle/pjs/vegeta_battle.gif', imagenGolpe: 'assets/icon/battle/hits/vegeta_hit.png', attack_hit: 'assets/icon/battle/attacks/vegeta_attack.gif', defense: 'assets/icon/battle/defense/vegeta_defense.png' },
    { name: 'Trunks', escenario: 'assets/icon/battle/stages/ciudad.png', sprite: 'assets/icon/battle/pjs/trunks_battle.gif', imagenGolpe: 'assets/icon/battle/hits/trunks_hit.png', attack_hit: 'assets/icon/battle/attacks/trunks_attack.gif', defense: 'assets/icon/battle/defense/trunks_defense.png' },
    { name: 'Freezer', escenario: 'assets/icon/battle/stages/namek.png', sprite: 'assets/icon/battle/pjs/freezer_battle.gif', imagenGolpe: 'assets/icon/battle/hits/freezer_hit.png', attack_hit: 'assets/icon/battle/attacks/freezer_attack.png', defense: 'assets/icon/battle/defense/freezer_defense.png' },
  ];

  // Lista del jugador
  public jugador = {
    name: 'Goku',
    sprite: 'assets/icon/battle/pjs/goku_battle.gif',
    vida: 100,
    animando: false,
    items: { semilla: 1, aguaKarin: 2 } as { semilla: number; aguaKarin: number } // Definimos el tipo explícitamente
  };

  public rival: any = null;
  public anim: any = null; // Para intentar animar al rival
  public escenario: string = '';
  public ronda: number = 0;

  public turnoJugador: boolean = true; // Indica si es el turno del jugador
  mensaje: string = '';

  public defendiendo = false; // Nuevo estado para saber si el jugador está defendiendo


  constructor(private router: Router, private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.cargarCombate(); // Cargar la batalla inicial

    // Llamar a las funciones dentro de los ataques para actualizar el HUD
    this.actualizarVidaRival();
    this.actualizarVidaJugador();
  }


  cargarCombate() {
    this.ronda = parseInt(localStorage.getItem('ronda') || '0', 10);

    if (this.ronda >= this.batallas.length) {
      alert('¡Has ganado el torneo!');
      this.router.navigate(['rpg']);
      return;
    }

    let combateActual = this.batallas[this.ronda];

    this.rival = {
      nombre: combateActual.name,
      sprite: combateActual.sprite,
      imagenGolpe: combateActual.imagenGolpe,
      attack_hit: combateActual.attack_hit,
      defense: combateActual.defense,
      vida: 100,
      animando: false
    };

    this.escenario = combateActual.escenario;
  }

  // Función para usar un ítem de curación
  usarItem(item: 'semilla' | 'aguaKarin') {  // 🔹 Definimos los valores posibles
    if (!this.turnoJugador) return; // Solo se pueden usar en el turno del jugador

    if (this.jugador.items[item] > 0) { // 🔹 Si el jugador tiene items disponibles
      if (item === 'semilla') {
        this.jugador.vida = 100; // 🔹 Cura toda la vida
        this.mensaje = '¡Goku usó una Judia Senzu! Vida restaurada al 100%.';
      } else if (item === 'aguaKarin') {
        this.jugador.vida = Math.min(this.jugador.vida + 50, 100); // 🔹 Cura la mitad de la vida (50%)
        this.mensaje = '¡Goku bebió Agua Sagrada de Karin! Vida restaurada parcialmente.';
      }

      this.jugador.items[item]--; // 🔹 Reduce la cantidad de ítems
      this.turnoJugador = false; // 🔹 Cambia el turno al rival después de usar el ítem

      setTimeout(() => this.ataqueRival(), 1500); // 🔹 Turno del rival tras usar el ítem
    } else {
      this.mensaje = "¡No te quedan más de este ítem!";
    }
  }


  // ATAQUE DEL JUGADOR
  atacar() {
    if (!this.turnoJugador) return;

    this.turnoJugador = false;
    this.mensaje = "¡Goku se lanza al ataque!";

    // 🔹 Cambia la imagen de Goku a animación de ataque
    this.jugador.animando = true;
    this.jugador.sprite = 'assets/icon/battle/attacks/goku_anim1.gif';

    setTimeout(() => {
      let daño = Math.floor(Math.random() * 20) + 10;
      this.rival.vida -= daño;
      this.mensaje = `¡Goku golpea a ${this.rival.nombre} causando ${daño} de daño!`;

      // 🔹 Cambia la imagen del rival a la de golpe recibido
      this.rival.animando = true;
      this.rival.sprite = this.rival.imagenGolpe;

      setTimeout(() => {
        this.jugador.animando = false;
        this.rival.animando = false;

        // 🔹 Volver a la imagen normal del rival
        this.jugador.sprite = 'assets/icon/battle/pjs/goku_battle.gif';
        this.rival.sprite = this.batallas[this.ronda].sprite;

        if (this.rival.vida <= 0) {
          this.rival.vida = 0;
          this.mensaje = "¡Goku Wins!";
          return;
        }

        setTimeout(() => this.ataqueRival(), 1000);
      }, 500); // Tiempo de golpe 
    }, 800); // Tiempo del rival
  }



  // DEFENSA DEL JUGADOR
  defender() {

    if (!this.turnoJugador) return; // Verifica si es el turno del jugador

    this.mensaje = `¡Goku se pone en guardia!.`;
    this.defendiendo = true; // Activa la defensa
    this.jugador.sprite = 'assets/icon/battle/defense/goku_defense.png'; // Cambia la imagen del jugador a la de defensa

    setTimeout(() => {
      this.turnoJugador = false; // 🔹 Cambia turno al rival
      this.ataqueRival(); // 🔹 Llamamos a la función de ataque del rival
    }, 1500);
  }

  // ATAQUE ESPECIAL DEL JUGADOR
  ataqueEspecial() {
    let daño = Math.floor(Math.random() * 30) + 20; // Genera un número aleatorio entre 0 y 29 (+20)
    this.rival.vida -= daño;
    this.mensaje = `Goku ataca a ${this.rival.nombre} con un ataque especial de ${daño} puntos de daño.`;

    if (this.rival.vida <= 0) {
      this.rival.vida = 0;
      this.mensaje = `Goku Wins!`;
      return;
    }
    this.turnoJugador = false;
    setTimeout(() => this.ataqueRival(), 1500);

  }

  // 🔹 Modificar el ataque del rival para que tenga en cuenta la defensa
  ataqueRival() {
    let accionCPU = Math.random(); // Generar un número entre 0 y 1

    if (accionCPU < 0.3) { // 30% de probabilidad de que el rival se defienda
      this.mensaje = `${this.rival.nombre} se pone en guardia.`;
      this.rival.sprite = this.rival.defense; // Cambia la imagen del rival a la de defensa

      setTimeout(() => {
        this.turnoJugador = true;
        this.rival.sprite = this.batallas[this.ronda].sprite;
      }, 1000);

      return; // No ataca, solo se defiende
    }

    let daño = Math.floor(Math.random() * 15) + 5; // Genera un número aleatorio entre 0 y 14 (+5)

    // 20% de probabilidad de que el rival use un ataque especial
    if (accionCPU < 0.8) {
      daño += 15;
      this.mensaje = `${this.rival.nombre} usa su ataque especial y causa ${daño} puntos de daño.`;
    } else {
      this.mensaje = `${this.rival.nombre} ataca a Goku y causa ${daño} puntos de daño.`;
    }

    // 🔹 Cambia la imagen del rival a animación de ataque
    this.rival.animando = true;
    this.rival.sprite = this.rival.attack_hit; // Rival pasando al ataque

    // ACCIONES DEL JUGADOR AL RECIBIR EL ATAQUE
    if (this.defendiendo) {
      daño = Math.floor(daño / 2);
      this.mensaje = `${this.rival.nombre} ataca, pero Goku bloquea y solo recibe ${daño} de daño.`;
      this.jugador.sprite = 'assets/icon/battle/defense/goku_defense.png'; // Cambia la imagen del jugador a la de defensa
    } else {
      this.mensaje = `${this.rival.nombre} ataca a Goku y causa ${daño} puntos de daño.`;
    }

    this.jugador.vida -= daño;
    this.defendiendo = false; // Reseteamos la defensa después del ataque

    // 🔹 Cambia la imagen del jugador a la de golpe recibido
    this.jugador.animando = true;
    this.jugador.sprite = 'assets/icon/battle/hits/goku_hit.png'; // Cambiar la imagen del jugador a la de golpe recibido

    setTimeout(() => {
      this.rival.animando = false;
      this.rival.sprite = this.batallas[this.ronda].sprite; // Volver a la imagen normal del rival

      setTimeout(() => {
        this.jugador.animando = false;
        this.jugador.sprite = 'assets/icon/battle/pjs/goku_battle.gif'; // Volver a la imagen normal del jugador

        if (this.jugador.vida <= 0) {
          this.jugador.vida = 0;  // Establece la vida del jugador en 0
          this.mensaje = `GAME OVER!`; // Si el jugador pierde, GAME OVER
          setTimeout(() => this.router.navigate(['rpg']), 2000);
          return;
        }

        this.turnoJugador = true; // Vuelve a ser el turno del jugador
      }, 400); // Tiempo para volver a la imagen normal del jugador
    }, 700); // Tiempo para volver a la imagen normal del rival
  }

  // AJUSTE DE BARRA DE VIDA DEL RIVAL EN TIEMPO REAL

  actualizarVidaRival() {
    let barraRival = document.getElementById('vidaRival');
    if (barraRival) {
      barraRival.style.width = this.rival.vida + `%`;
    }
  }

  // AJUSTE DE BARRA DE VIDA DEL JUGADOR EN TIEMPO REAL
  actualizarVidaJugador() {
    let barraJugador = document.getElementById('vidaJugador');
    if (barraJugador) {
      barraJugador.style.width = this.jugador.vida + `%`;
    }
  }

  // Función para avanzar a la siguiente batalla
  siguienteCombate() {
    if (this.rival.vida <= 0) {
      this.ronda++;
      localStorage.setItem('ronda', this.ronda.toString());
      this.cargarCombate();
    }

    // SI EL JUGADOR GANA EL TORNEO
    if (this.ronda >= this.batallas.length) {
      this.finalizarTorneo();
      return;
    }
  }

  // BACKEND FUNCIONES (REVISAR)
  finalizarTorneo() {
    let userData = {
      email: '', // Se obtiene de Auth0 al iniciar sesión
      puntos: 100 // 🔹 Puntos que sumará al ganar el torneo
    };

    this.http.put('https://dragonball-rpg-backend.onrender.com/usuarios/ranking', userData)
      .subscribe(response => {
        console.log('Ranking actualizado:', response);
        alert("¡Has ganado el torneo! +100 puntos añadidos");
        this.router.navigate(['/rpg']); // Vuelve al menú principal
      }, error => {
        console.error('Error al actualizar el ranking', error);
      });
  }
}
