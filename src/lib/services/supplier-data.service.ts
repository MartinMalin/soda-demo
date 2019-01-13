import { Injectable } from '@angular/core';
import { Supplier } from '../models/supplier';
import { SupplierService } from './supplier.service';

@Injectable()
export class SupplierDataService {

    private suppliers: Promise<Supplier[]> = null;

    constructor(private supplierService: SupplierService) { }

    public getSuppliers(): Promise<Supplier[]> {
        if (this.suppliers === null) {
            this.suppliers = this.supplierService.getSuppliers();
        }

        return this.suppliers;
    }
}
