import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssetListComponent } from './components/assets/asset-list/asset-list.component';
// import { DemoPageComponent } from './demo/demo-page/demo-page.component';

const routes: Routes = [
    // { path: '', redirectTo: '/demo', pathMatch: 'full' },
    // {
    //     path: 'demo',
    //     component: DemoPageComponent
    // },
    {
        path: '',
        component: AssetListComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {
}
