import { Component, OnInit } from '@angular/core';
import { Repository } from './repository/repository';
import { ConfigurationService } from './configuration.service';
import { SpinnerService } from '../shared/providers/spinner.service';
import 'rxjs/add/operator/do';
import { AutoUnsubscribe } from '../shared/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import { MdDialog, MdSnackBarConfig, MdSnackBar } from '@angular/material';
import { FindCollaboratorDialog } from './collaborator/add-collaborator/find-collaborator-dialog.component';
import { User } from './collaborator/user/user';
import { CollaboratorService } from './collaborator/collaborator.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
@AutoUnsubscribe()
export class ConfigurationComponent implements OnInit {

  private repositories: Repository[];
  private reposFiltered: Repository[]=[];
  private repositoriesSubscription: Subscription;
  private dialogSubscription: Subscription;
  searchTerm: string;
  userFound: boolean = false;
  user: User;

  constructor(private configurationService: ConfigurationService,
              private spinnerService: SpinnerService,
              private dialog: MdDialog,
              private collaboratorService: CollaboratorService,
              private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.spinnerService.showSpinner();

    // Get the list of accounts
    this.repositoriesSubscription = this.configurationService.getRepositories()
                                        .filter(repositories => !!repositories)
                                        .do(()=> this.spinnerService.hideSpinner())
                                        .subscribe(
        (repositories) => this.repositories = repositories,
                                          (error) => console.error(error)
      );
  }

  openFindUser() {

    const dialog = this.dialog.open(FindCollaboratorDialog, { width: '33%' });

    this.dialogSubscription = dialog.afterClosed()
                                    .subscribe(result => {
                                      if(result != undefined){
                                        this.user = result;
                                      this.getRepositoriesFiltered();
                                      }
                                    });

  }

  getRepositoriesFiltered() {
    for (const repository of this.repositories) {
      if (repository.canAdmin) {
        this.checkIsCollaborator(repository);
      }
    }
    if(this.reposFiltered.length != 0){
      this.repositories = this.reposFiltered;
    }
  }

  cancelAddCollaborator(){
    location.reload();
  }

  addCollaborator(){
      if (this.user) {
        let reposSelected: Repository[] = [];
        for (const repo of this.reposFiltered) {
          if (repo.selected) {
            reposSelected.push(repo);
          }
        }
        if (reposSelected.length != 0) {
                for (const repository of reposSelected) {
                    this.collaboratorService.addCollaborator(repository, this.user);
                }
                //this.snackBar.open('Collaborator successfully added', null, { duration: 2000 } as MdSnackBarConfig)
                //location.reload();
        }
      }
  }

  private checkIsCollaborator(repository: Repository): void {
    let found = false;
    if (repository.collaborators != null) {
      found = repository.collaborators.find(collaborator => collaborator.username == this.user.username) == undefined ? false : true;
    }

    if (!found) {
      this.userFound=true;
      this.reposFiltered.push(repository);
    }
  }

  private handleUserFound(result: any) {
    console.log(result);
  }
}
