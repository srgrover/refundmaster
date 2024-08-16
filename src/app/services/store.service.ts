import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, DocumentReference, CollectionReference, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';

export interface Store {
  id?: string;
  name: string;
  image?: string;
  createdAt?: Timestamp;
}

@Injectable({
  providedIn: 'root'
})

export class StoreService {
  private collectionName = 'stores';
  private storesCollection: CollectionReference<Store>;

  constructor(private firestore: Firestore) {
    this.storesCollection = collection(this.firestore, this.collectionName) as CollectionReference<Store>;
  }

  getStores(): Observable<Store[]> {
    return collectionData(this.storesCollection, { idField: 'id' }) as Observable<Store[]>;
  }

  async addStore(store: Store): Promise<DocumentReference<Store>> {
    store.createdAt = Timestamp.now();
    return addDoc(this.storesCollection, store);
  }

  updateStore(store: Store): Promise<void> {
    const storeDoc = doc(this.firestore, `${this.collectionName}/${store.id}`);
    return updateDoc(storeDoc, { ...store });
  }

  deleteStore(storeId: string): Promise<void> {
    const storeDoc = doc(this.firestore, `${this.collectionName}/${storeId}`);
    return deleteDoc(storeDoc);
  }
}
