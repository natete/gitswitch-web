import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FindCollaboratorDialog } from './add-collaborator/find-collaborator-dialog.component';
import { CollaboratorService } from './collaborator.service';
import { FormsModule } from '@angular/forms';
import { Usermodule } from './user/user.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    Usermodule
  ],
  declarations: [FindCollaboratorDialog],
  entryComponents: [FindCollaboratorDialog],
  providers: [CollaboratorService]
})
export class Collaboratormodule {
}