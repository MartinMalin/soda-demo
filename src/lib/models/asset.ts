import {Category} from './category';
import {Supplier} from "./supplier";
import {Collection} from "./collection";
import {ContentLocation} from "./content_location";
import {AssociatedMedia} from "./associated_media";

export class Asset {
    id: number;
    fileFormat: string;
    supplier: Supplier;
    originalType: string;
    alternateName: string;
    width: number;
    height: number;
    collection: Collection;
    onlyEditorialUsage: boolean;
    uploadDate: Date;
    activationTime: Date;
    name: string;
    dateModified: Date;
    color: boolean;
    orientation: string;
    exclusivePrice: number;
    photographerCode: string;
    copyright: string;
    license: string;
    specificSupplierProvisionPercentageState: string;
    specificSupplierProvisionPercentage: string;
    modelReleased: number;
    propertyReleased: number;
    aggregateRating: number;
    categories: Category[];
    byline: string;
    bylineTitle: string;
    contentLocation: ContentLocation[];
    transmissionreference: string;
    copyrightHolder: string;
    caption: string;
    keywords: string[];
    dateCreated: Date;
    objectName: string;
    headline: string;
    source: string;
    creditLine: string;
    associatedMedia: AssociatedMedia[];
    calculatorPackage: number;
    optionalFilesize: number;
}
