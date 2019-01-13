import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SuggestService } from '../../services/suggest.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * Component that provides the functionality to search for existing asset types
 */
@Component({
    selector: 'st-asset-search-input',
    templateUrl: './asset-search-input.component.html',
    styleUrls: ['./asset-search-input.component.css']
})
export class AssetSearchInputComponent implements OnInit, OnDestroy {

    /**
     * Search fomr group
     */
    public form: FormGroup;

    /**
     * Subject of options base
     * @type {Subject<any>}
     */
    public optionsBase: Subject<any> = new Subject<any>();

    /**
     * Observable of options
     * @type {null}
     */
    public options: Observable<any> = null;

    private lastKeywordChange = 0;

    @Output() searchText: EventEmitter<string> = new EventEmitter<string>();

    dataSubscription: Subscription;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private suggestionService: SuggestService) {
        this.form = this.fb.group({
            search: ''
        });
    }

    ngOnInit() {
        const stream = this.form.valueChanges.map(data => {
                             this.lastKeywordChange = (new Date('now')).getTime();
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

                if (keyword === '') {
                    return Observable.empty();
                }
                return this.suggestionService
                           .getSuggestions(keyword)
                           .map(result => result.map(str => {
                               str = str.toLowerCase();
                               return {
                                   text: str.replace(keyword, '<strong>' + keyword + '</strong>'),
                                   value: str
                               };
                           }));
            });

        this.options = Observable.merge(this.optionsBase, suggestOptions);


        this.dataSubscription = stream.debounceTime(600)
              .distinctUntilChanged()
              .subscribe(data => {
                  this.searchText.next((data.search));
              });
    }

    checkSearch(event) {
        if (event.key === 'Enter') {
            this.hideAutocomplete();
        } else if (event.key === 'Escape') {
            this.hideAutocomplete();
        }
    }

    hideAutocomplete() {
        this.optionsBase.next(null);
    }

    ngOnDestroy(): void {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    }

}
