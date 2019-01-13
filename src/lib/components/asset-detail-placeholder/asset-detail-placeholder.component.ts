import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';

/**
 * Component for displaying a placeholder for the asset details
 */
@Component({
    selector: 'st-asset-detail-placeholder',
    templateUrl: './asset-detail-placeholder.component.html',
    styleUrls: ['./asset-detail-placeholder.component.css']
})
export class AssetDetailPlaceholderComponent implements OnInit {

    @Output() close = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
    }

    /**
     * Called when the user clicked close
     * @param {Event} e
     */
    onCloseClicked(e: Event) {
        e.preventDefault();
        this.close.next();
    }

}
