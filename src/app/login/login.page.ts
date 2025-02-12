import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonGrid, IonRow, IonCol, IonButton, IonContent } from '@ionic/angular/standalone';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { Router } from '@angular/router'; // Importa Router para la redirección

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonButton, IonContent, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  constructor(private auth: AuthService, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.auth.isAuthenticated$.subscribe(loggedIn => {
      if (loggedIn) {
        // Obtener los datos del usuario
        this.auth.user$.subscribe(user => {
          if (user) {
            console.log('Usuario autenticado:', user);
            this.datosUsuario(user); // Llama a la función para enviar los datos del usuario
            this.router.navigate(['/rpg']); // Redirige a la página "rpg"
          }
        });
      }
    });
  }

  login(): void { // BOTÓN DE INICIO DE SESIÓN
    this.auth.loginWithRedirect(); // 🔹 Redirige a la página de login de Auth0
  }

  datosUsuario(user: any): void {
    let userData = {
      name: user.name,
      email: user.email
    };

    console.log('Datos enviados al backend:', userData); // Log para verificar los datos
    this.http.post('http://localhost:3000/usuarios', userData)
      .subscribe(response => {
        console.log('Usuario guardado en el backend', response);
      }, error => {
        console.error('Error al guardar el usuario en el backend', error);
      });
  }
}