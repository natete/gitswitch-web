import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { UserService } from './user.service';
import { UserComponent } from './user.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [UserComponent],
  declarations: [UserComponent],
  providers: [UserService]
})
export class Usermodule {
}