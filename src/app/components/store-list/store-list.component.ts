import { Component, OnInit } from '@angular/core';
import { StoreService, Store } from '../../services/store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})

export class StoreListComponent {
  stores: Store[] = [];

  constructor(private storeService: StoreService) { }

  ngOnInit() {
    this.storeService.getStores().subscribe(data => {
      this.stores = data;
      console.log(this.stores)
    });
  }

  deleteStore(storeId: string) {
    this.storeService.deleteStore(storeId).then(() => {
      console.log('Store deleted');
    });
  }
}
