import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  constructor() {}

  /**
   * Show toast notification
   */
  showToast(title: string, type: 'success' | 'error' | 'info' = 'success') {
    let bgColor = '#fff';
    let textColor = '#333';
    if (type === 'success') {
      bgColor = '#e8fff1';
      textColor = '#0f5132';
    } else if (type === 'error') {
      bgColor = '#ffe8e8';
      textColor = '#842029';
    }
    Swal.fire({
      title,
      icon: type,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      background: bgColor,
      color: textColor,
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
