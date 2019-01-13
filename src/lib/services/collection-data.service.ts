import { Injectable } from '@angular/core';
import { Collection } from '../models/collection';
import { CollectionService } from './collection.service';

@Injectable()
export class CollectionDataService {

    private collections: Promise<Collection[]> = null;

    constructor(private collectionService: CollectionService) { }


    public getCollections(): Promise<Collection[]> {
        if (this.collections === null) {
            this.collections = this.collectionService.getCollections();
        }

        return this.collections;
    }


}
