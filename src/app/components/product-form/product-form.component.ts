import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

export enum RefundStatus {
  EDIT = 'edit',
  NEW = 'new'
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})

export class ProductFormComponent {
  modes = RefundStatus;
  productForm: FormGroup;
  mode: RefundStatus = this.modes.NEW;
  productId!: string;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      value: [0, [Validators.required]],
      quantity: [0, [Validators.required]],
      refunded: [false, [Validators.required]],
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.productId = id;
      this.mode = this.modes.EDIT;
      this.productService.getAllProducts().subscribe({
        next: (data) => {
          if(data) this.fillForm(data.find(product => product.id === id) as Product);
        }
      });
    }
  }

  onSubmit(mode: RefundStatus) {
    console.log(this.productForm)
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if(mode === this.modes.EDIT) this.updateProduct(productData, this.productId);
      else this.addNewProduct(productData);
    } else console.error('Form is not valid');
  }

  addNewProduct = (product: Product) => {
    this.productService.addProduct(product).then(() => {
      console.info('Product added successfully');
      this.router.navigate(['/products']);
    }).catch((error: any) => console.error('Error adding product:', error));
  }

  updateProduct = (product: Product, id: string) => {
    product.id = id;
    this.productService.updateProduct(product).then(() => {
      console.info('Product updated successfully');
      this.router.navigate(['/products']);
    }).catch(error => console.error('Error updating product:', error));
  }

  fillForm(product: Product){
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      value: product.value,
      quantity: product.quantity,
      refunded: product.refunded,
    });
  }
}
