import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { Collaboratormodule } from './collaborator/collaborator.module';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationService } from './configuration.service';
import { CollaboratorService } from './collaborator/collaborator.service';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RepositoryModule } from './repository/repository.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RepositoryModule,
    SharedModule
  ],
  exports: [
    Collaboratormodule
  ],
  declarations: [
    ConfigurationComponent
  ],
  providers: [ConfigurationService, CollaboratorService]
})
export class ConfigurationModule {
}