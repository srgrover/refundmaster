import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  constructor() { }

  async showAlert(options: SweetAlertOptions): Promise<SweetAlertResult<any>>{
    return await  Swal.fire(options);
  }
}
