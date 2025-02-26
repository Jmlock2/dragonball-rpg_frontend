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
    { name: 'Piccolo', escenario: 'assets/icon/battle/stages/torneo.png', sprite: 'assets/icon/battle/pjs/piccolo_battle.gif', imagenGolpe: 'assets/icon/battle/hits/piccolo_hit.png', attack_hit: 'assets/icon/battle/attacks/piccolo_attack.png', defense: 'assets/icon/battle/defense/piccolo_defense.png', defeated: 'assets/icon/battle/defeated/piccolo_derrotado.png', victory: 'assets/icon/battle/victory/piccolo_victory.png' },
    { name: 'Vegeta', escenario: 'assets/icon/battle/stages/desierto.png', sprite: 'assets/icon/battle/pjs/vegeta_battle.gif', imagenGolpe: 'assets/icon/battle/hits/vegeta_hit.png', attack_hit: 'assets/icon/battle/attacks/vegeta_attack.gif', defense: 'assets/icon/battle/defense/vegeta_defense.png', defeated: 'assets/icon/battle/defeated/vegeta_derrotado.png', victory: 'assets/icon/battle/victory/vegeta_victory.png' },
    { name: 'Trunks', escenario: 'assets/icon/battle/stages/ciudad.png', sprite: 'assets/icon/battle/pjs/trunks_battle.gif', imagenGolpe: 'assets/icon/battle/hits/trunks_hit.png', attack_hit: 'assets/icon/battle/attacks/trunks_attack.gif', defense: 'assets/icon/battle/defense/trunks_defense.png', defeated: 'assets/icon/battle/defeated/trunks_derrotado.png', victory: 'assets/icon/battle/victory/trunks_victory.png' },
    { name: 'Freezer', escenario: 'assets/icon/battle/stages/namek.png', sprite: 'assets/icon/battle/pjs/freezer_battle.gif', imagenGolpe: 'assets/icon/battle/hits/freezer_hit.png', attack_hit: 'assets/icon/battle/attacks/freezer_attack.png', defense: 'assets/icon/battle/defense/freezer_defense.png', defeated: 'assets/icon/battle/defeated/freezer_derrotado.png', victory: 'assets/icon/battle/victory/freezer_victory.png' },
  ];

  // Lista del jugador
  public jugador = {
    name: 'Goku',
    sprite: 'assets/icon/battle/pjs/goku_battle.gif',
    vida: 100,
    animando: false,
    items: { semilla: 3, aguaKarin: 4 } as { semilla: number; aguaKarin: number } // Definimos el tipo explícitamente
  };

  public usosItem: { [item: string]: number } = {
    semilla: 0,
    aguaKarin: 0
  };

  public rival: any = null;
  public anim: any = null; // Para intentar animar al rival
  public escenario: string = '';
  public ronda: number = 0;

  public turnoJugador: boolean = true; // Indica si es el turno del jugador
  mensaje: string = '';

  public defendiendo = false; // Nuevo estado para saber si el jugador está defendiendo

  public ataqueEspecialUsado: number = 0; // Variable para contar el uso del ataque especial

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
      this.actualizarRanking();
      this.router.navigate(['ranking']);
      return;
    }

    let combateActual = this.batallas[this.ronda];

    this.rival = {
      nombre: combateActual.name,
      sprite: combateActual.sprite,
      imagenGolpe: combateActual.imagenGolpe,
      attack_hit: combateActual.attack_hit,
      defense: combateActual.defense,
      victory: combateActual.victory,
      defeated: combateActual.defeated,
      vida: 100,
      animando: false
    };

    this.escenario = combateActual.escenario;
  }

  // Función para usar un ítem de curación
  usarItem(item: 'semilla' | 'aguaKarin') {  // 🔹 Definimos los valores posibles
    if (!this.turnoJugador) return; // Solo se pueden usar en el turno del jugador

    if (this.jugador.items[item] > 0) { // 🔹 Si el jugador tiene items disponibles
      if (this.usosItem[item] >= 2) {
        this.mensaje = "¡No puedes usar más de este ítem en esta ronda!";
        return;
      }

      if (item === 'semilla') {
        this.jugador.vida = 100; // 🔹 Cura toda la vida
        this.actualizarVidaJugador();
        this.mensaje = '¡Goku usó una Judia Senzu! Vida restaurada al 100%.';
      } else if (item === 'aguaKarin') {
        this.jugador.vida = Math.min(this.jugador.vida + 50, 100); // 🔹 Cura la mitad de la vida (50%)
        this.actualizarVidaJugador();
        this.mensaje = '¡Goku bebió Agua Sagrada de Karin! Vida restaurada parcialmente.';
      }

      this.jugador.items[item]--; // 🔹 Reduce la cantidad de ítems
      this.usosItem[item]++; // 🔹 Incrementa el contador de usos
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
      this.actualizarVidaRival();
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
          this.rival.sprite = this.rival.defeated;
          this.jugador.sprite = 'assets/icon/battle/victory/goku_victory.png';
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

    this.turnoJugador = false;
    this.mensaje = `¡Goku se pone en guardia!.`;
    this.defendiendo = true; // Activa la defensa
    this.jugador.sprite = 'assets/icon/battle/defense/goku_defense.png'; // Cambia la imagen del jugador a la de defensa

    setTimeout(() => {
      this.turnoJugador = false; // 🔹 Cambia turno al rival
      this.jugador.sprite = 'assets/icon/battle/pjs/goku_battle.gif';
      this.ataqueRival(); // 🔹 Llamamos a la función de ataque del rival
    }, 1500);
  }

  // ATAQUE ESPECIAL DEL JUGADOR
  ataqueEspecial() {
    if (!this.turnoJugador) return;

    if (this.ataqueEspecialUsado >= 2) { // Verifica si se ha utilizado 2 veces
      this.mensaje = "¡No puedes usar el ataque especial más veces!";
      return;
    }

    this.ataqueEspecialUsado++; // Incrementa el contador

    this.turnoJugador = false;
    this.mensaje = "¡¡KAIOKEN!!";

    // 🔹 Cambia la imagen de Goku a animación de ataque
    this.jugador.animando = true;
    this.jugador.sprite = 'assets/icon/battle/special/kaioken.gif'; // Cambia la imagen del jugador a la de ataque especial

    setTimeout(() => {
      let daño = Math.floor(Math.random() * 30) + 20;
      this.rival.vida -= daño;
      this.actualizarVidaRival();
      this.mensaje = `¡Goku golpea a ${this.rival.nombre} con su ataque especial causando ${daño} de daño!`;

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
          this.rival.sprite = this.rival.defeated;
          this.jugador.sprite = 'assets/icon/battle/victory/goku_victory.png';
          this.mensaje = "¡Goku Wins!";
          return;
        }

        setTimeout(() => this.ataqueRival(), 1000);
      }, 500); // Tiempo de golpe 
    }, 800); // Tiempo del rival
  }

  // 🔹 Modificar el ataque del rival para que tenga en cuenta la defensa
  ataqueRival() {
    let accionCPU = Math.random(); // Generar un número entre 0 y 1

    if (accionCPU < 0.3) { // 30% de probabilidad de que el rival se defienda
      this.mensaje = `${this.rival.nombre} se pone en guardia.`;
      this.rival.sprite = this.rival.defense; // Cambia la imagen del rival a la de defensa

      // 🔥 SOLO SI ES FREEZER, RECUPERA VIDA AL DEFENDERSE
      if (this.rival.nombre === 'Freezer') {
        let vidaRecuperada = Math.floor(Math.random() * 10) + 5; // Recupera entre 5 y 15 de vida
        this.rival.vida = Math.min(this.rival.vida + vidaRecuperada, 100); // No puede pasar de 100
        this.actualizarVidaRival();
        this.mensaje += ` ¡Freezer recupera ${vidaRecuperada} puntos de vida! 🔥`;
      }

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
    this.actualizarVidaJugador();
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
          this.jugador.sprite = 'assets/icon/battle/defeated/goku_derrotado.png'; // Cambia la imagen del jugador a la de derrota
          this.mensaje = `GAME OVER!`; // Si el jugador pierde, GAME OVER
          setTimeout(() => this.router.navigate(['rpg']), 5000);
          return;
        }

        this.turnoJugador = true; // Vuelve a ser el turno del jugador
      }, 400); // Tiempo para volver a la imagen normal del jugador
    }, 700); // Tiempo para volver a la imagen normal del rival
  }
  // 🎇 AJUSTE DE BARRA DE VIDA DEL RIVAL EN TIEMPO REAL

  actualizarVidaRival() {
    let barraRival = document.getElementById('vidaRival') as HTMLIonProgressBarElement;
    if (barraRival) {

      if (this.rival.vida <= 25) {
        barraRival.color = 'danger';
      } else if (this.rival.vida <= 50) {
        barraRival.color = 'warning';
      } else {
        barraRival.color = 'success';
      }
    }
  }

  // 🎇 AJUSTE DE BARRA DE VIDA DEL JUGADOR EN TIEMPO REAL
  actualizarVidaJugador() {
    let barraJugador = document.getElementById('vidaJugador') as HTMLIonProgressBarElement;
    if (barraJugador) {
      // No es necesario actualizar el ancho aquí
      // La barra de progreso se ajustará automáticamente al contenedor

      // Establece el color según la vida del jugador
      if (this.jugador.vida <= 25) {
        barraJugador.color = 'danger';
      } else if (this.jugador.vida <= 50) {
        barraJugador.color = 'warning';
      } else {
        barraJugador.color = 'success';
      }
    }
  }

  // Función para avanzar a la siguiente batalla
  siguienteCombate() {
    if (this.rival.vida <= 0) {
      this.ronda++;
      localStorage.setItem('ronda', this.ronda.toString());
      this.mensaje = '';
      this.jugador.sprite = 'assets/icon/battle/pjs/goku_battle.gif'; // Cambia la imagen del jugador a la normal
      this.turnoJugador = true;
      this.ataqueEspecialUsado = 0; // Resetear el contador
      this.usosItem = { semilla: 0, aguaKarin: 0 };

      this.cargarCombate(); // Primero carga el nuevo combate
      setTimeout(() => { // Espera un breve instante antes de actualizar el ranking
        this.actualizarRanking();
      }, 100); // Le damos 100ms para asegurarnos de que `this.ronda` esté actualizado
    }

    // SI EL JUGADOR GANA EL TORNEO
    if (this.ronda >= this.batallas.length) {
      return;
    }
  }

  actualizarRanking(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        let data = {
          auth0_id: user.sub, // ID de Auth0
          name: user.name, // Nombre del usuario
          score: 100 // Se sumarán 100 puntos por victoria
        };

        console.log("🏆 Enviando actualización de ranking:", data);

        this.http.put('https://dragonball-rpg-backend.onrender.com/ranking', data).subscribe({
          next: (response: any) => {
            console.log("✅ Ranking actualizado correctamente:", response);
          },
          error: (error) => {
            console.error("❌ Error al actualizar ranking:", error);
          }
        });
      }
    });
  }

}



// CUANDO EL JUGADOR PIERDA, LAS RONDAS SERÁN RESETEADAS

// AGREGAR SONIDO AL JUEGO

// CREAR BASE DE DATOS EN RENDER.COM PARA LA SUMA DE PUNTOS (RANKING)

/* Antiguo código actualizarRanking 
actualizarRanking(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        const data = {
          auth0_id: user.sub, // ID de Auth0
          name: user.name, // Nombre del usuario
          score: 10 // Se sumarán 100 puntos por victoria
        };
  
        console.log("🏆 Enviando actualización de ranking:", data);
  
        this.http.put('https://dragonball-rpg-backend.onrender.com/ranking', data).subscribe({
          next: (response: any) => {
            console.log("✅ Ranking actualizado correctamente:", response);
          },
          error: (error) => {
            console.error("❌ Error al actualizar ranking:", error);
          }
        });
      }
    });
  } */