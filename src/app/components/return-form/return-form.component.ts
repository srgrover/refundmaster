import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Return, ReturnService } from '../../services/return.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, StoreService } from '../../services/store.service';

@Component({
  selector: 'app-return-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './return-form.component.html',
  styleUrl: './return-form.component.css'
})
export class ReturnFormComponent {
  returnForm: FormGroup;
  editMode: boolean = false;
  return$!: Observable<Return | undefined>;
  returnId!: string;
  storeList: Store[] = [];
  
  constructor(
    private fb: FormBuilder,
    private returnService: ReturnService,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    
    this.returnForm = this.fb.group({
      product: ['', [Validators.required]],
      value: ['', [Validators.required]],
      returnDate: ['', [Validators.required]],
      refunded: ['', [Validators.required]],
      orderNumber: [''],
      trackingNumber: [''],
      returnCode: [''],
      storeId: ['', [Validators.required]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.getStoreList();

    if (id) {
      this.returnId = id;
      this.editMode = true;
      this.returnService
        .getReturnById(id)
        .subscribe({
          next: (returnData) => {
            if (returnData) {
              this.fillForm(returnData);
            }
          },
          error: (error) => {
            console.error('Error fetching return:', error);
          }
      });
    }
  }

  onSubmit(editMode: boolean) {
    console.log(this.returnForm)
    
    if (this.returnForm.valid) {
      const returData = this.returnForm.value;
      if(editMode){
        returData.id = this.returnId;
        this.returnService.updateReturn(returData).then(() => {
          console.info('Return updated successfully');
          this.router.navigate(['/returns']);
        }).catch(error => {
          console.error('Error updating return:', error);
        });
      } else {
        this.returnService.addReturn(returData).then(() => {
          console.info('Return added successfully');
          this.router.navigate(['/returns']);
        }).catch((error: any) => {
          console.error('Error adding return:', error);
        });
      }
    } else {
      console.error('Form is not valid');
    }
  }

  getStoreList = () => {
    this.storeService.getStores().subscribe({
      next: (stores) => this.storeList = stores,
      error: (error) => console.error('Error fetching stores:', error)
    });
  }

  fillForm(returnData: Return){
    this.returnForm.patchValue({
      product: returnData.product,
      value: returnData.value,
      returnDate: returnData.returnDate,
      refunded: returnData.refunded,
      orderNumber: returnData.orderNumber,
      trackingNumber: returnData.trackingNumber,
      returnCode: returnData.returnCode,
      storeId: returnData.storeId
    });
  }
}
