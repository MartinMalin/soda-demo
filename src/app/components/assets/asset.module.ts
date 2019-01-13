import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { SodatechSdkModule } from '../../../lib/sodatech-sdk.module';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetSearchComponent } from './asset-search/asset-search.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SodatechSdkModule,
        RouterModule,
        MatProgressSpinnerModule,
    ],
    declarations: [
        AssetListComponent,
        AssetSearchComponent,
    ],
    exports: [
        AssetListComponent,
        AssetSearchComponent,
    ]
})
export class AssetModule {}
