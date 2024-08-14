import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

export interface Return {
  id?: string;
  product: string;
  value: number;
  returnDate: firebase.firestore.Timestamp;
  refunded: boolean;
  storeId: string;
  createdAt?: firebase.firestore.Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private collectionName = 'returns';

  constructor(private firestore: AngularFirestore) { }

  getReturns(): Observable<Return[]> {
    return this.firestore.collection<Return>(this.collectionName).valueChanges({ idField: 'id' });
  }

  addReturn(returnItem: Return) {
    returnItem.createdAt = firebase.firestore.Timestamp.now();
    return this.firestore.collection(this.collectionName).add(returnItem);
  }

  updateReturn(returnItem: Return) {
    return this.firestore.collection(this.collectionName).doc(returnItem.id).update(returnItem);
  }

  deleteReturn(returnId: string) {
    return this.firestore.collection(this.collectionName).doc(returnId).delete();
  }
}
