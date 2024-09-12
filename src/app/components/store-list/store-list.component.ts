import { Component } from '@angular/core';
import { StoreService, Store } from '../../services/store.service';
import { CommonModule } from '@angular/common';
import { ReturnService } from '../../services/return.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})

export class StoreListComponent {
  stores: Store[] = [];
  returnCounts: { [storeId: string]: number } = {};

  constructor(private storeService: StoreService, private returnService: ReturnService, private router: Router) { }

  ngOnInit() {
    this.storeService.getStores().subscribe(data => {
      this.stores = data;
      console.log(data)
      this.updateReturnCounts();
    });
  }

  updateReturnCounts() {
    const observables = this.stores.map(store => 
      this.returnService.getReturnsCountByStoreId(store.id || '').then(count => ({
        storeId: store.id,
        count
      }))
    );

    Promise.all(observables).then(results => {
      results.forEach(result => {
        this.returnCounts[result.storeId] = result.count;
      });
    }).catch(error => {
      console.error('Error fetching return counts:', error);
    });
  }

  goToStoreForm() {
    this.router.navigate(['/stores/new']);
  }
}
