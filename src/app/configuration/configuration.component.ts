import { Component, OnInit } from '@angular/core';
import { Repository } from './repository/repository';
import { ConfigurationService } from './configuration.service';
import { SpinnerService } from '../shared/providers/spinner.service';
import 'rxjs/add/operator/do';
import { AutoUnsubscribe } from '../shared/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import { MdDialog } from '@angular/material';
import { FindCollaboratorDialog } from './collaborator/add-collaborator/find-collaborator-dialog.component';
import { User } from './collaborator/user/user';

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

  constructor(private configurationService: ConfigurationService,
              private spinnerService: SpinnerService,
              private dialog: MdDialog) { }

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
                                      this.handleUserFound(result);
                                      this.getRepositoriesFiltered(result);
                                      }
                                    });

  }

  getRepositoriesFiltered(user: User) {
    for (const repository of this.repositories) {
      if (repository.canAdmin) {
        this.checkIsCollaborator(repository, user);
      }
    }
    if(this.reposFiltered.length != 0){
      this.repositories = this.reposFiltered;
    }
  }

  private checkIsCollaborator(repository: Repository, user: User): void {
    let found = false;
    if (repository.collaborators != null) {
      found = repository.collaborators.find(collaborator => collaborator.username == user.username) == undefined ? false : true;
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
