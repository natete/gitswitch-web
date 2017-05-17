import { Component, OnInit } from '@angular/core';
import { Repository } from './repository/repository';
import { ConfigurationService } from './configuration.service';
import { SpinnerService } from '../shared/providers/spinner.service';
import 'rxjs/add/operator/do';
import { AutoUnsubscribe } from '../shared/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import { MdDialog, MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { FindCollaboratorDialog } from './collaborator/add-collaborator/find-collaborator-dialog.component';
import { User } from './collaborator/user/user';
import { CollaboratorService } from './collaborator/collaborator.service';
import { Collaborator } from './collaborator/collaborator';

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
    this.userFound = false;
    this.reposFiltered = [];
    this.spinnerService.showSpinner();

    // Get the list of accounts
    this.repositoriesSubscription = this.configurationService.getRepositories()
                                        .filter(repositories => !!repositories)
                                        .do(()=> this.spinnerService.hideSpinner())
                                        .subscribe(
                                          (repositories) => this.repositories = repositories,
                                          (error) => console.error(error)
      );

    this.configurationService.refreshConnectedRepositories();
  }

  /**
   * Open dialog to find users to add collaborator
   */
  openFindUser() {
    this.user = null;
    const dialog = this.dialog.open(FindCollaboratorDialog);

    this.dialogSubscription = dialog.afterClosed()
                                    .subscribe(result => {
                                      if(result != undefined){
                                        this.user = result;
                                        this.getRepositoriesFiltered();
                                      }
                                    });

  }

  /**
   * Get repositories where the user is not collaborating
   */
  getRepositoriesFiltered() {
    for (const repository of this.repositories) {
      //The user has permission
      if (repository.canAdmin) {
        this.checkIsCollaborator(repository);
      }
    }
    if (this.reposFiltered.length != 0){
      this.repositories = this.reposFiltered;
    } else{
      this.snackBar.open('User has not repositories to add collaborator', null, { duration: 2000 } as MdSnackBarConfig);
    }
    this.spinnerService.hideSpinner();
  }

  /**
   * Cancel the filtered repositories and get all repositories again
   */
  cancelAddCollaborator(){
    for (const repo of this.reposFiltered) {
      if (repo.selected) {
        repo.selected = false;
      }
    }
    this.ngOnInit();
  }

  addCollaborator(){
      if (this.user) {
        this.spinnerService.showSpinner();
        let reposSelected: Repository[] = [];
        for (const repo of this.reposFiltered) {
          if (repo.selected) {
            repo.selected = false;
            reposSelected.push(repo);
          }
        }
        if (reposSelected.length != 0) {
                for (const repository of reposSelected) {
                    this.collaboratorService.addCollaborator(repository, this.user)
                        .do(() => this.spinnerService.hideSpinner())
                        .subscribe(
                          () => {
                            const collaborator = new Collaborator();
                            collaborator.id = this.user.id;
                            collaborator.username = this.user.username;
                            collaborator.photoUrl = this.user.photoUrl;
                            repository.collaborators.push(collaborator);
                          },
                          error => console.error(error),
                          () => console.log('completed')
                        );
                }
          this.ngOnInit();
          this.snackBar.open('Collaborator successfully added', null, { duration: 2000 } as MdSnackBarConfig);
        } else {
          this.spinnerService.hideSpinner();
          this.snackBar.open('You must select almost one repository', null, { duration: 2000 } as MdSnackBarConfig);
        }
      }
  }

  /**
   * Check if the user isn't collaborator in the repository to get filtered repositories
   */
  private checkIsCollaborator(repository: Repository): void {
    let found = false;
    if (repository.collaborators != null) {
      found = !!repository.collaborators.find(collaborator => collaborator.username == this.user.username);
    }

    if (!found) {
      this.userFound=true;
      this.reposFiltered.push(repository);
    }
  }
}
