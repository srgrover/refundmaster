import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, CollectionReference, doc, updateDoc, deleteDoc, query, where, getDocs, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Timestamp, onSnapshot } from 'firebase/firestore';
import { Product } from './product.service';
import { Store } from './store.service';

export interface Return {
  id: string;
  product: string;
  value: number;
  returnDate: Timestamp;
  refunded: boolean;
  orderNumber?: string;
  trackingNumber?: string;  
  returnCode?: string;
  storeId: string;
  store: Store;
  products: any[];
  createdAt?: Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private collectionName = 'returns';
  private returnCollection: CollectionReference<Return>;

  constructor(private firestore: Firestore) {
    this.returnCollection = collection(this.firestore, this.collectionName) as CollectionReference<Return>;
  }

  getReturns(): Observable<Return[]> {
    return new Observable(observer => {
      const colRef = collection(this.firestore, this.collectionName);
      const unsub = onSnapshot(colRef, snapshot => {
        const returns: Return[] = snapshot.docs.map(doc => ({
          ...(doc.data() as Return),
          id: doc.id
        }));
        observer.next(returns);
      });
      return () => unsub();
    });
  }

  getReturnById(storeId: string): Observable<Return | undefined> {
    const storeDocRef = doc(this.firestore, `${this.collectionName}/${storeId}`);
    return docData(storeDocRef, { idField: 'id' }) as Observable<Return | undefined>;
  }

  async addReturn(returnItem: Return): Promise<void> {
    returnItem.createdAt = Timestamp.now();
    await addDoc(this.returnCollection, returnItem);
  }

  async updateReturn(returnItem: Return): Promise<void> {
    if (returnItem.id) {
      const docRef = doc(this.firestore, `${this.collectionName}/${returnItem.id}`);
      await updateDoc(docRef, {...returnItem});
    }
  }

  async deleteReturn(returnId: string): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${returnId}`);
    await deleteDoc(docRef);
  }

  async getReturnsCountByStoreId(storeId: string): Promise<number> {
    const q = query(this.returnCollection, where('storeId', '==', storeId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }
}
