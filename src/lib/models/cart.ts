import {Article} from './article';

export class Cart {
    id: number;
    objectDescription: string;
    memo: string;
    totalNettoPriceRaw: number;
    totalNettoPrice: number;
    discountPercentage: number;
    discount: number;
    discountDescription: number;
    modifiedOn: Date;
    createdOn: Date;
    proposalDownloadMaxSize: number;
    proposalDownloadMaxSizeType: string;
    totalPrice: number;
    vatPercentage: number;
    vat: number;
    title: string;
    currency: string;
    articles: Article[];
}
