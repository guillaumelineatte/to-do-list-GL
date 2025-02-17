import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseTestService {
  constructor(private firestore: AngularFirestore) {}

  testConnection() {
    return this.firestore.collection('test').valueChanges();
  }
}
