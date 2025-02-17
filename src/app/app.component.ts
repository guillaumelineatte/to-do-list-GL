import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FirebaseTestService } from './services/firebase-test.service';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Test Firebase</h1>
      <p *ngIf="connectionStatus">Connexion réussie ! 🎉</p>
      <p *ngIf="error">Erreur de connexion : {{error}}</p>
    </div>
  `
})
export class AppComponent implements OnInit {
  connectionStatus = false;
  error: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private firebaseTest: FirebaseTestService
  ) {}

  ngOnInit() {
    this.firebaseTest.testConnection().subscribe({
      next: () => {
        this.connectionStatus = true;
      },
      error: (err) => {
        this.error = err.message;
        console.error('Erreur Firebase:', err);
      }
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
}
