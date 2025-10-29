import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-content-header',
    standalone: false,
    templateUrl: './content-header.component.html',
    styleUrls: ['./content-header.component.scss']
})

export class ContentHeader {
    @Input() pageName: string = '';
    @Input()routePath: any[] = [{}];

}