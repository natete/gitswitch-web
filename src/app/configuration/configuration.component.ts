import { Component, OnInit } from '@angular/core';
import { Repository } from './repository/repository';
import { ConfigurationService } from './configuration.service';
import { SpinnerService } from '../shared/providers/spinner.service';
import 'rxjs/add/operator/do';
import { AutoUnsubscribe } from '../shared/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';
import { MdDialog } from '@angular/material';
import { FindCollaboratorDialog } from './collaborator/add-collaborator/find-collaborator-dialog.component';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
@AutoUnsubscribe()
export class ConfigurationComponent implements OnInit {

  private repositories: Repository[];
  private repositoriesSubscription: Subscription;
  private dialogSubscription: Subscription;
  searchTerm: string;

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
                                    .subscribe(result => this.handleUserFound(result));
  }

  private handleUserFound(result: any) {
    console.log(result);
  }
}
