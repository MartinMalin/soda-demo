import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LightboxDataService } from '../../services/lightbox-data.service';
import { CartDataService } from '../../services/cart-data.service';
import { AssociatedMedia } from '../../models/associated_media';

/**
 * Component for displaying the asset in the list
 */
@Component({
    selector: 'st-list-asset-thumb',
    templateUrl: './list-asset-thumb.component.html',
    styleUrls: ['./list-asset-thumb.component.css']
})
export class ListAssetThumbComponent implements OnInit, OnChanges {

    @Input() asset: any = {};
    @Input() lightboxId: number = null;
    @Output() detail = new EventEmitter<any>();

    assetFile: AssociatedMedia;

    constructor(private hostElement: ElementRef,
                private sanitizer: DomSanitizer,
                private lightboxDataService: LightboxDataService,
                private cartDataService: CartDataService) {
    }

    ngOnInit() {
    }


    ngOnChanges(changes: any) {
        if (changes.asset && changes.asset.currentValue) {
            const asset = changes.asset.currentValue;

            this.assetFile = this.getFittingAssetFile(asset);
        }
    }


    getFittingAssetFile(asset: any): any {
        let assetFile = null;
        for (const tmpFile of asset.associatedMedia) {
            if (tmpFile.fileFormat !== 'image/jpeg' || tmpFile.additionalType.indexOf(
                'watermarked') >= 0 || tmpFile.additionalType == 'original') {
                continue;
            }
            assetFile = tmpFile;
        }

        return assetFile;
    }

    showImageDetail(): void {
        this.detail.emit({
            id: this.asset.id,
            element: this.hostElement,
            asset: this.asset
        });
    }

    getCopyright(): string {
        if (this.asset.supplier && this.asset.supplier.copyright) {
            return this.asset.supplier.copyright;
        }

        return 'Panoramic Images';
    }

    addToLightbox(event) {
        event.stopPropagation();

        this.lightboxDataService.addAsset(this.asset.id, '');
    }

    addToCart(event) {
        event.stopPropagation();
        this.cartDataService.addArticle(this.asset.id);
    }

    isInLightbox(): boolean {
        const lightboxId = this.getLightboxId();
        return this.lightboxDataService.isAssetInLightbox(lightboxId, this.asset.id);
    }

    isInCart(): boolean {
        return this.cartDataService.isAssetInCart(this.asset.id);
    }

    deleteFromLightbox(event) {
        event.stopPropagation();
        const lightboxId = this.getLightboxId();
        this.lightboxDataService.deleteAsset(lightboxId, this.asset.id);
    }

    getLightboxId(): number {
        return (this.lightboxId > 0) ? this.lightboxId : this.lightboxDataService.getSelectedLightboxId();
    }
}
