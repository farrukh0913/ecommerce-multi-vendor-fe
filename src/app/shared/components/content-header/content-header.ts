import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-content-header',
    standalone: false,
    templateUrl: './content-header.html',
    styleUrls: ['./content-header.scss']
})

export class ContentHeader {
    @Input() pageName: string = '';
    @Input()routePath: any[] = [{}];

}