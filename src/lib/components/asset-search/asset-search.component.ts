import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Asset } from '../../models/asset';
import { AssetService } from '../../services/asset.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

/**
 * Component that provides the functionality to display the asset grid and displaying a spinner while loading the assets
 */
@Component({
    selector: 'st-asset-search',
    templateUrl: './asset-search.component.html',
    styleUrls: ['./asset-search.component.css']
})
export class AssetSearchComponent implements OnInit, OnDestroy {

    /**
     * Oberservable of assets loaded from the api
     */
    loadedAssets$: Observable<Asset[]>;

    /**
     * List of displayed assets
     * @type {any[]}
     */
    assets: Asset[] = [];

    /**
     * BehaviourSubject of the searchText
     * @type {BehaviorSubject<string>}
     */
    searchText$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    /**
     * Search text input
     * @param {string} searchText
     */
    @Input() set searchText(searchText: string) {
        this.currentSearchText = searchText;
        this.searchText$.next(searchText);
    }

    /**
     * Grid item target width for the grid layout
     */
    @Input() gridItemTargetWidth: number;

    /**
     * Grid layout
     */
    @Input() layout: string;

    /**
     * BehaviourSubject for the next page
     * @type {BehaviorSubject<number>}
     */
    private nextPage$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    /**
     * Data subscriptions array
     * @type {any[]}
     */
    dataSubscriptions: Subscription[] = [];

    /**
     * Flag that indicates whether data is loaded or not
     */
    dataLoading: boolean;

    /**
     * Current search text
     */
    currentSearchText: string;

    currentPage: number;

    constructor(private assetService: AssetService) {
        this.loadedAssets$ = Observable.combineLatest(this.searchText$.filter(Boolean),
            this.nextPage$.filter(Boolean)
        ).switchMap(([searchKey, page]) => {
            if (searchKey && searchKey !== ''
                && this.currentSearchText
                && this.currentSearchText !== '') {
                this.dataLoading = true;
                return this.assetService.getAssets({ searchKey, page });
            } else {
                return Observable.empty();
            }
        });
    }

    ngOnInit() {
        this.dataSubscriptions.push(this.loadedAssets$.subscribe((assets: any) => {
                this.dataLoading = false;
                this.assets = [...this.assets, ...assets.assets];
            }),
            this.searchText$.subscribe(text => {
                this.assets = [];
                this.currentPage = 1;
                this.nextPage$.next(1);
            })
        );
    }

    ngOnDestroy(): void {
        this.dataSubscriptions.map(subscription => subscription.unsubscribe());
    }

    /**
     * Called when more assets should be loaded
     */
    onLoadMoreAssets() {
        if (!this.dataLoading) {
            this.nextPage$.take(1).subscribe(nextPage => this.nextPage$.next(nextPage + 1));
        }
    }

}
