import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

export interface Store {
  id?: string;
  name: string;
  address?: string;
  contactEmail?: string;
  createdAt?: firebase.firestore.Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private collectionName = 'stores';

  constructor(private firestore: AngularFirestore) { }

  getStores(): Observable<Store[]> {
    return this.firestore.collection<Store>(this.collectionName).valueChanges({ idField: 'id' });
  }

  addStore(store: Store) {
    store.createdAt = firebase.firestore.Timestamp.now();
    return this.firestore.collection(this.collectionName).add(store);
  }

  updateStore(store: Store) {
    return this.firestore.collection(this.collectionName).doc(store.id).update(store);
  }

  deleteStore(storeId: string) {
    return this.firestore.collection(this.collectionName).doc(storeId).delete();
  }
}
