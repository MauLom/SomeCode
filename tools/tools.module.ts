import { NgModule } from '@angular/core';
import { BuscadorCopsisComponent } from './buscador-sio/buscador-copsis.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';

export const ROOT_TOOLS: any[] = [

  BuscadorCopsisComponent,

]

@NgModule({
  declarations:[ROOT_TOOLS],
  imports: [
    MaterialModule,
    FormsModule,
  ],
  exports:[ROOT_TOOLS]
})
export class RooToolsModule {}  
