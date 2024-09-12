import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, StoreService } from '../../services/store.service';
import { Observable } from 'rxjs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SweetAlert2Module],
  templateUrl: './store-form.component.html',
  styleUrl: './store-form.component.css'
})
export class StoreFormComponent {
  storeForm: FormGroup;
  editMode: boolean = false;
  store$!: Observable<Store | undefined>;
  storeId!: string;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required]],
      image: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.storeId = id;
      this.editMode = true;
      this.store$ = this.storeService.getStoreById(id);
      this.store$.subscribe({
        next: (store) => {
          if (store) {
            this.fillForm(store);
          }
        },
        error: (error) => {
          console.error('Error fetching store:', error);
        }
      });
    }
  }

  onSubmit(editMode: boolean) {
    if (this.storeForm.valid) {
      const store = this.storeForm.value;
      if(editMode){
        store.id = this.storeId;
        this.storeService.updateStore(store).then(() => {
          console.info('Store updated successfully');
          this.router.navigate(['/stores']);
        }).catch(error => {
          console.error('Error updating store:', error);
        });
      } else {
        this.storeService.addStore(store).then(() => {
          console.info('Store added successfully');
          this.router.navigate(['/stores']);
        }).catch(error => {
          console.error('Error adding store:', error);
        });
      }
    } else {
      console.error('Form is not valid');
    }
  }

  deleteStore(storeId: string): void {
    this.storeService.deleteStore(storeId).then(() => {
      console.info('Store deleted successfully');
      this.router.navigate(['/stores']);
    }).catch(error => {
      console.error('Error deleting store:', error);
    });
  }

  showConfirmAlert = async() => {
    const options: SweetAlertOptions = {
      title: 'Eliminaremos la tienda!',
      text: `¿Estás seguro de querer eliminar la tienda '${this.storeForm.get('name')?.value}'? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonColor: '#ED474A',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'Cancelar',
    }

    const resultModal = await this.alertService.showAlert(options)
    
    if(resultModal.isConfirmed) this.deleteStore(this.storeId);
  }

  fillForm(store: Store){
    this.storeForm.patchValue({
      name: store.name,
      image: store.image,
    });
  }
}
