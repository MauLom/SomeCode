import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SioLoaderDirective } from './loader/loader.directive';


// components

export const ROOT_TOOLS: any[] = [
    SioLoaderDirective,
];

@NgModule({
    declarations: [ROOT_TOOLS],
    imports: [        
        FormsModule
    ],
    exports: [ROOT_TOOLS],
    providers: []
})
export class DirectiveModule {}