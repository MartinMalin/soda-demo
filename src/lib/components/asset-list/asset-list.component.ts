import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    Input, OnChanges,
    Output, SimpleChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DragulaService } from 'ng2-dragula';
import { Asset } from '../../models/asset';
import { WindowRefService } from '../../services/window-ref.service';

/**
 * Component that provides the functionallity to render the assets in different layouts
 */
@Component({
    selector: 'st-asset-list',
    templateUrl: './asset-list.component.html',
    styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent implements AfterViewChecked, DoCheck, AfterViewInit, OnChanges {

    @Input('lightboxId')
    set setDragulaId(id: number) {
        this.dragulaId = 'lb_bag_' + String(id);
        this.lightboxId = id;
    }

    @Input() sortable: boolean = false;

    @Output() orderChange = new EventEmitter<any>();

    @Input('assets')
    set setInputAssets(assets: Asset[]) {
        this.setAssets(assets);
    }

    @Input() layout: string = 'masonry-grid';

    @Input() gridItemTargetWidth: number = 200;

    /**
     * List of assets
     * @type {any[]}
     */
    public assets: any = [];

    public lightboxId: number = null;

    private previousAssetPositions = {};

    /**
     * Gird item width for the grid layout
     */
    gridItemWidth: number;

    /**
     * Flag that indicates whether the layout was changed or not
     */
    layoutChanged: boolean;

    private assetsTmp: any = [];
    private defaultHeight: number = 150;
    showDetailId: number;
    showDetailAsset: any;
    private detailLoaded: number = null;
    private defaultMarginWidth = 10;
    private currentHostWidth = 0;
    public dragulaId: string = '';

    public dragulaOptions = {
        direction: 'horizontal'
    };

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.checkHostSizeChange();
    }

    constructor(private hostElement: ElementRef,
                private changeDetectorRef: ChangeDetectorRef,
                @Inject(DOCUMENT) private document: any,
                private window: WindowRefService,
                private dragulaService: DragulaService) {
        dragulaService.drop.subscribe((value) => {
            if (value[0] !== this.dragulaId) {
                return;
            }

            const element = value[4];
            let newPos = null;
            const target = value[2];
            const assetId = value[1].dataset['assetid'];

            if (!element) {
                newPos = target.children.length - 1;
            } else {
                for (let i = 0; i < target.children.length; i++) {
                    if (target.children[i].dataset['assetid'] === element.dataset['assetid']) {
                        newPos = i - 1;
                        break;
                    }
                }
            }

            const oldPos = this.previousAssetPositions[assetId];
            this.previousAssetPositions = this.getPositionList(this.assets);

            this.orderChange.emit({
                assetId: assetId,
                from: oldPos,
                to: newPos
            });
        });
    }


    ngAfterViewInit(): void {
        setTimeout(() => {
            this.checkHostSizeChange();
        }, 1);
    }

    public reset() {
        this.showDetailId = null;
        this.showDetailAsset = null;
        this.detailLoaded = null;
        this.assets = [];
        this.assetsTmp = [];
    }

    private getPositionList(assetList: any[]) {
        const list = {};
        let i = 0;
        for (const asset of assetList) {
            list[asset.id] = i;
            i++;
        }

        return list;
    }

    public setAssets(assets) {
        if (!Array.isArray(assets)) {
            assets = [];
        }

        /*        if (JSON.stringify(assets) === JSON.stringify(this.assets)) {
                    console.log("RETURN ME");
                    return;
                }*/

        this.assets = assets;
        this.previousAssetPositions = this.getPositionList(assets);

        this.refreshSize();
    }

    public addAssets(assets) {
        this.setAssets(this.assets.concat(assets));
    }

    public getBoundingClientRect(): ClientRect {
        if (!this.hostElement.nativeElement.getBoundingClientRect) {
            let rect = {
                bottom: 0,
                height: 0,
                left: 0,
                right: 0,
                top: 0,
                width: 0,
            };

            return rect as ClientRect;
        }
        return this.hostElement.nativeElement.getBoundingClientRect();
    }


    public refreshSize() {
        if (this.layout === 'masonry-grid') {
            if (!this.assets || !this.assets.length) {
                return;
            }

            let combinedWidth = 0;
            let assetRow = [];
            this.assetsTmp = [];

            for (let asset of this.assets) {
                if (!asset.sizeFactor) {
                    asset.sizeFactor = asset.width / asset.height;
                }

                let newWidth = this.defaultHeight * asset.sizeFactor;

                if (combinedWidth + newWidth + this.defaultMarginWidth > this.currentHostWidth) {

                    this.addAssetsTmp(assetRow, combinedWidth);

                    combinedWidth = 0;
                    assetRow = [];
                }

                combinedWidth += newWidth;
                assetRow.push(asset);
            }

            if (assetRow.length > 0) {
                for (let asset2 of assetRow) {
                    asset2.displayHeight = this.defaultHeight + 'px';
                    asset2.displayWidth = (this.defaultHeight * asset2.sizeFactor) / this.currentHostWidth * 100 + '%';
                    this.assetsTmp.push(asset2);
                }
            }

            this.assets = this.assetsTmp;
        } else if (this.layout === 'grid') {
            if (this.assets.length * this.gridItemTargetWidth > this.currentHostWidth) {
                this.gridItemWidth = this.currentHostWidth / Math.round(this.currentHostWidth / this.gridItemTargetWidth);
            } else {
                this.gridItemWidth = this.gridItemTargetWidth;
            }
        }


        this.changeDetectorRef.detectChanges();
    }

    private addAssetsTmp(assetRow: any, combinedWidth: number): void {
        let newHeight = this.defaultHeight * (this.currentHostWidth / combinedWidth);

        for (let asset2 of assetRow) {
            asset2.displayHeight = Math.floor(newHeight) + 'px';
            asset2.displayWidth = (newHeight * asset2.sizeFactor) / this.currentHostWidth * 100 + '%';
            asset2.marginWidth = this.defaultMarginWidth + 'px';
            this.assetsTmp.push(asset2);
        }
    }


    showAssetDetail(event: any): void {
        this.showDetailId = event.id;
        this.showDetailAsset = event.asset;
    }

    closeAssetDetail(event: any): void {
        this.scrollToAsset(this.showDetailId);
        this.showDetailId = null;
    }

    ngDoCheck() {
        this.checkHostSizeChange();
    }

    checkHostSizeChange() {
        const style = getComputedStyle(this.hostElement.nativeElement);
        const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

        const rect = this.getBoundingClientRect();
        const newWidth = rect.width - paddingX;

        // if the width is still the same and the layout has not changed
        if (this.currentHostWidth === newWidth && !this.layoutChanged) {
            return;
        }

        this.currentHostWidth = newWidth;

        this.refreshSize();
        this.layoutChanged = false;
    }

    ngAfterViewChecked() {

    }

    previousAsset(event: any): void {
        let previousAsset = null;
        for (let asset of this.assets) {
            if (asset.id == this.showDetailId) {
                if (!previousAsset) {
                    return;
                }

                this.showDetailAsset = previousAsset;
                this.showDetailId = previousAsset.id;

                return;
            }

            previousAsset = asset;
        }

    }

    nextAsset(event: any): void {
        let assetMatched = false;
        for (let asset of this.assets) {
            if (assetMatched) {
                this.showDetailAsset = asset;
                this.showDetailId = asset.id;

                return;
            } else if (asset.id == this.showDetailId) {
                assetMatched = true;
            }
        }

    }

    scrollToAsset(assetId) {
        let assetThumb = this.hostElement.nativeElement.querySelector('[data-assetid="' + assetId + '"]');

        if (!assetThumb.getBoundingClientRect) {
            return;
        }

        let elementTop = assetThumb.getBoundingClientRect().top;
        elementTop += (this.window.nativeWindow.pageYOffset !== undefined) ? this.window.nativeWindow.pageYOffset : (this.document.documentElement || this.document.body).scrollTop;
        elementTop -= 55;

        if (this.document.scrollingElement) {
            this.document.scrollingElement.scrollTop = elementTop;
        } else {
            this.window.nativeWindow.scrollTo(0, elementTop);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if the layout has changed the change dection has to run agaiin to calculate the changes
        if (changes['layout'] && this.layout) {
            this.layoutChanged = true;
            this.changeDetectorRef.detectChanges();
        }
    }
}
