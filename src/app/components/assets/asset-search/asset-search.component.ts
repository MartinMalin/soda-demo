import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject, Subscription, Observable, Subject } from "rxjs";

import { SuggestService } from "../../../../lib/services/suggest.service";

@Component({
    selector: "st-asset-search",
    templateUrl: "./asset-search.component.html",
    styleUrls: ["./asset-search.component.css"]
})
export class AssetSearchComponent implements OnInit {
    @Output() searchText: EventEmitter<string> = new EventEmitter<string>();
    subscription: Subscription;
    public options: Observable<any> = null;
    public form: FormGroup;
    public optionsBase: Subject<any> = new Subject<any>();
    private lastKeywordChange = 0;
    isLoading = false;

    constructor(
        private suggestionService: SuggestService,
        private fb: FormBuilder
    ) {}

    ngOnInit() {
        this.form = this.fb.group({
            search: ""
        });

        const stream = this.form.valueChanges.map(data => {
            this.lastKeywordChange = new Date("now").getTime();
            return data;
        });

        const suggestOptions = stream
            .debounceTime(200)
            .distinctUntilChanged()
            .switchMap(data => {
                const keyword = String(data.search).trim();
                if (keyword.length < 2) {
                    return Observable.of(null);
                }

                if (keyword === "") {
                    return Observable.empty();
                }
                return this.suggestionService
                    .getSuggestions(keyword)
                    .map(result =>
                        result.map(str => {
                            str = str.toLowerCase();
                            return {
                                text: str,
                                value: str
                            };
                        })
                    );
            });

        this.options = Observable.merge(this.optionsBase, suggestOptions);

        this.subscription = stream
            .debounceTime(600)
            .distinctUntilChanged()
            .subscribe(data => {
                this.searchText.next(data.search);
            });
    }

    checkSearch(event) {
        if (event.key === "Enter") {
            this.hideAutocomplete();
        } else if (event.key === "Escape") {
            this.hideAutocomplete();
        }
    }

    hideAutocomplete() {
        this.optionsBase.next(null);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
