import { Component, OnInit } from '@angular/core';

/**
 * Component for demonstrating the sodatech sdk
 */
@Component({
    selector: 'app-demo-page',
    templateUrl: './demo-page.component.html',
    styleUrls: ['./demo-page.component.css']
})
export class DemoPageComponent implements OnInit {

    /**
     * Asset layout
     * @type {string}
     */
    layout: string = 'grid';

    /**
     * Current search text
     * @type {string}
     */
    searchText: string = '';

    /**
     * Grid item width for the grid layout
     * @type {number}
     */
    gridItemTargetWidth: number = 200;

    constructor() {
    }

    ngOnInit() {
    }

    /**
     * Called when the search text has changed
     * @param {string} searchText
     */
    onSearchTextChanged(searchText: string) {
        this.searchText = searchText;
    }

}
