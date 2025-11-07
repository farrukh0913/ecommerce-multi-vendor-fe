import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {

  constructor() {}

  /**
   * Show toast notification
   */
  showToast(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      customClass: {
        popup: 'slide-in-right',
        icon: 'no-tick-anim',
      },
      showClass: {
        popup: 'slide-in-right',
      },
      hideClass: {
        popup: 'slide-out-right',
      },
      didOpen: (toast) => {
        toast.addEventListener('click', () => {
          Swal.close();
        });
      },
    });
  }
}
