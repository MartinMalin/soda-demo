import { NgModule } from '@angular/core';
// import { AssetSearchInputComponent } from './components/asset-search-input/asset-search-input.component';
import { UserLoginService } from './services/user-login.service';
import { MatAutocompleteModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuggestService } from './services/suggest.service';
import { HttpModule } from '@angular/http';
import { SodaApiServiceProvider } from './services/soda-api.service.provider';
import { Ng2Webstorage } from 'ngx-webstorage';
// import { AssetListComponent } from './components/asset-list/asset-list.component';
// import { MasonryGridAssetThumbComponent } from './components/masonry-grid-asset-thumb/masonry-grid-asset-thumb.component';
import { RemoveFileExtensionPipe } from './pipes/remove-file-extension.pipe';
import { PreferencesService } from './services/preferences.service';
import { LightboxService } from './services/lightbox.service';
import { UserDataService } from './services/user-data.service';
import { CartService } from './services/cart.service';
import { CartDataService } from './services/cart-data.service';
import { DragulaModule } from 'ng2-dragula';
import { SupplierDataService } from './services/supplier-data.service';
import { CollectionDataService } from './services/collection-data.service';
import { AssetService } from './services/asset.service';
import { AssetSearchComponent } from './components/asset-search/asset-search.component';
import { SupplierService } from './services/supplier.service';
import { WindowRefService } from './services/window-ref.service';
import { LightboxDataService } from './services/lightbox-data.service';
import { UserService } from './services/user.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { InfiniteScrollModule } from '@thisissoon/angular-infinite-scroll';
// import { AssetDetailPlaceholderComponent } from './components/asset-detail-placeholder/asset-detail-placeholder.component';
// import { GridAssetThumbComponent } from './components/grid-asset-thumb/grid-asset-thumb.component';
// import { ListAssetThumbComponent } from './components/list-asset-thumb/list-asset-thumb.component';
// import { GridLayouts } from './models/grid-layouts';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Webstorage,
        MatAutocompleteModule,
        DragulaModule,
        InfiniteScrollModule,
    ],
    declarations: [
        // AssetSearchInputComponent,
        // AssetListComponent,
        // MasonryGridAssetThumbComponent,
        // GridAssetThumbComponent,
        // ListAssetThumbComponent,
        RemoveFileExtensionPipe,
        // AssetSearchComponent,
        // AssetDetailPlaceholderComponent
    ],
    providers: [
        SodaApiServiceProvider,
        UserLoginService,
        SuggestService,
        PreferencesService,
        LightboxService,
        UserDataService,
        CartService,
        CartDataService,
        SupplierDataService,
        CollectionDataService,
        AssetService,
        SupplierService,
        WindowRefService,
        LightboxDataService,
        UserService
    ],
    // exports: [AssetSearchInputComponent, AssetSearchComponent, AssetListComponent],
    exports: [InfiniteScrollModule, MatAutocompleteModule]
})
export class SodatechSdkModule {
}
