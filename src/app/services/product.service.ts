import { Injectable } from '@angular/core';
import { collection, addDoc, doc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Firestore, Timestamp, collectionData } from '@angular/fire/firestore';

export interface Product {
  id: string;
  name: string;
  value: number;
  quantity: number;
  refunded: boolean;
  createdAt?: Timestamp;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private collectionName = 'product';
  private products: Product[];
  private products$: Subject<Product[]>;

  constructor(private firestore: Firestore) {
    this.products = [];
    this.getProducts();
    this.products$ = new Subject();
  }

  getAllProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getProductDataById = (id: string) => {
    return this.products.find(product => product.id === id);
  }

  async getProducts(): Promise<Observable<Product[]>> {
    const productCollectionRef = collection(this.firestore, this.collectionName);
    const result = collectionData(productCollectionRef, { idField: 'id' }) as Observable<Product[]>;
    result.subscribe({
      next: (data) => {
        this.products = data;
        console.log(this.products)
        this.products$.next(this.products);
      },
      error: (error) => console.error('Error fetching products:', error),
      complete: () => console.log('Products fetched successfully')
    })
    return result;
  }

  getProductById(productId: string): Observable<Product | undefined> {
    const productDocRef = doc(this.firestore, `${this.collectionName}/${productId}`);
    return docData(productDocRef, { idField: 'id' }) as Observable<Product | undefined>;
  }

  async addProduct(product: Product): Promise<void> {
    const productCollectionRef = collection(this.firestore, this.collectionName);
    product.createdAt = Timestamp.now();
    await addDoc(productCollectionRef, product);
    this.products.push(product);
    this.products$.next(this.products);
  }

  updateProduct(product: Product): Promise<void> {
    console.log(product)
    const productDocRef = doc(this.firestore, `${this.collectionName}/${product.id}`);
    return updateDoc(productDocRef, { ...product });
  }

  deleteProduct(productId: string): Promise<void> {
    const docRef = doc(this.firestore, `products/${productId}`);
    return deleteDoc(docRef);
  }
}
