import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { combineLatest } from "rxjs/observable/combineLatest";

import { Asset } from "../../../../lib/models/asset";
import { AssetService } from "../../../../lib/services/asset.service";

@Component({
    selector: "st-asset-list",
    templateUrl: "./asset-list.component.html",
    styleUrls: ["./asset-list.component.css"]
})
export class AssetListComponent implements OnInit {

    subscription: Subscription[] = [];
    loadedAssets$: Observable<Asset[]>;
    assets: Asset[] = [];
    dataLoading: boolean;
    currentPage: number;
    searchText$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private nextPage$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    constructor(private assetService: AssetService) {}

    ngOnInit() {
        this.loadedAssets$ = combineLatest(
            this.searchText$.filter(Boolean)
            .pipe(
                debounceTime(800),
                distinctUntilChanged(),
            ),
            this.nextPage$.filter(Boolean)
        ).switchMap(([searchKey, page]) => {
            if (
                searchKey &&
                searchKey !== "" &&
                this.searchText$.value &&
                this.searchText$.value !== ""
            ) {
                this.dataLoading = true;
                return this.assetService.getAssets({ searchKey, page });
            } else {
                return Observable.empty();
            }
        });

        this.subscription.push(
            this.loadedAssets$.subscribe((assets: any) => {
                this.dataLoading = false;
                this.assets = [...this.assets, ...assets.assets];
            }),
            this.searchText$
            .subscribe(() => {
                this.assets = [];
                this.currentPage = 1;
                this.nextPage$.next(1);
            })
        );
    }

    onLoadMoreAssets() {
        if (!this.dataLoading) {
            this.nextPage$
                .take(1)
                .subscribe(nextPage => this.nextPage$.next(nextPage + 1));
        }
    }

    ngOnDestroy(): void {
        this.subscription.map(subscription => subscription.unsubscribe());
    }
}
