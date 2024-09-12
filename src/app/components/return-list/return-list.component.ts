import { Component, LOCALE_ID } from '@angular/core';
import { Return, ReturnService } from '../../services/return.service';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { CommonModule, DatePipe } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { Product, ProductService } from '../../services/product.service';

registerLocaleData(localeEs, 'esp');

@Component({
  selector: 'app-return-list',
  standalone: true,
  imports: [DatePipe, CommonModule, RouterLink],
  providers: [{ provide: LOCALE_ID, useValue: 'esp' }],
  templateUrl: './return-list.component.html',
  styleUrl: './return-list.component.css'
})
export class ReturnListComponent {
  returns: Return[] = [];

  constructor(private storeService: StoreService, private returnService: ReturnService, private productService: ProductService, private router: Router) { }

  ngAfterViewInit() {
    if (initFlowbite) {
      initFlowbite();
    }
  }

  ngOnInit() {
    initFlowbite();

    this.returnService.getReturns().subscribe({
      next: (data) => {
        this.returns = data;
        console.log(this.returns)
        
        this.returns.forEach((ret: Return) => {
          let productList: Product[] = [];
          if(ret.products){
            ret.products.map((productId: string) => {
              this.productService.getProductById(productId).subscribe({
                next: (productData) => {
                  if (productData) productList.push(productData);
                },
                error: (error) => console.error('Error fetching product:', error),
              });
            })
          }

          ret.products = productList;

          this.storeService.getStoreById(ret.storeId).subscribe({
            next: (storeData) => {
              if (storeData) {
                ret.store = storeData;
              }
            },
            error: (error) => {
              console.error('Error fetching store:', error);
            }
          })
          console.log("this.returns",this.returns)
        });
        console.log("this.returns FUERA",this.returns)
      },
      error: (error) => {
        console.error('Error fetching returns:', error);
      }
    });
  }

  deleteReturn(returnId: string) {
    this.storeService.deleteStore(returnId).then(() => {
      console.info('Return deleted');
    });
  }

  goToReturnForm() {
    this.router.navigate(['/returns/new']);
  }

  aaaal(ddloptions: any){
    console.log(ddloptions)
  }
}
