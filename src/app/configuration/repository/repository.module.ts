import { NgModule } from '@angular/core';
import { RepositoryComponent } from './repository.component';
import { MaterialModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  exports: [RepositoryComponent],
  declarations: [RepositoryComponent]
})
export class RepositoryModule {
}