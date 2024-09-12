import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, DocumentReference, CollectionReference, doc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { Observable, map } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

export interface Store {
  id: string;
  name: string;
  image?: string;
  createdAt?: Timestamp;
}

@Injectable({
  providedIn: 'root'
})

export class StoreService {
  private collectionName = 'stores';


  constructor(private firestore: Firestore) {
  }

  getStores(): Observable<Store[]> {
    const storeCollectionRef = collection(this.firestore, this.collectionName);
    return collectionData(storeCollectionRef, { idField: 'id' }) as Observable<Store[]>;
  }

  getStoreById(storeId: string): Observable<Store | undefined> {
    const storeDocRef = doc(this.firestore, `${this.collectionName}/${storeId}`);
    return docData(storeDocRef, { idField: 'id' }) as Observable<Store | undefined>;
  }

  async addStore(store: Store): Promise<void> {
    const storeCollectionRef = collection(this.firestore, this.collectionName);
    store.createdAt = Timestamp.now();
    await addDoc(storeCollectionRef, store);
  }

  updateStore(store: Store): Promise<void> {
    console.log(store)
    const storeDocRef = doc(this.firestore, `${this.collectionName}/${store.id}`);
    return updateDoc(storeDocRef, { ...store });
  }

  deleteStore(storeId: string): Promise<void> {
    const docRef = doc(this.firestore, `stores/${storeId}`);
    return deleteDoc(docRef);
  }
}
