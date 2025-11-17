import { Component, EventEmitter, Input, Output } from '@angular/core';
import { R2UploadService } from '../../services/r2-upload.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-image-thumbnail',
  standalone: false,
  templateUrl: './image-thumbnail.html',
  styleUrl: './image-thumbnail.scss',
})
export class ImageThumbnail {
  @Input() imageUrl!: string;
  @Input() icon: boolean = true;
  @Output() deleted = new EventEmitter<string>();
  r2BaseUrl: string = environment.r2BaseUrl + '/';

  constructor(private r2: R2UploadService, private spinner: NgxUiLoaderService) {}

  ngOnInit() {
    console.log('this.imageUrl: ', this.imageUrl);
  }

  async onDelete() {
    try {
      this.spinner.start();
      await this.r2.deleteFileFromR2(this.r2BaseUrl + this.imageUrl);
      this.deleted.emit(this.imageUrl);
      this.imageUrl = '';
      this.spinner.stop();
    } catch (err) {
      this.spinner.stop();
      console.error('Delete failed:', err);
    }
  }
}
