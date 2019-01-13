import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DemoPageComponent } from './demo-page/demo-page.component';
import { SodatechSdkModule } from '../../lib/sodatech-sdk.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        // SodatechSdkModule,
        RouterModule,
    ],
    declarations: [
        // DemoPageComponent,
    ],
    exports: [
        // DemoPageComponent,
    ]
})
export class DemoModule {}
