import { Component, Input, OnInit } from '@angular/core';
import { Account } from '../account';
import { AccountService } from '../account.service';
import { MdSnackBar } from '@angular/material';
import { DialogsService } from '../../shared/dialogs/dialogs.service';
import { SpinnerService } from '../../shared/providers/spinner.service';
import 'rxjs/add/operator/do';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe/auto-unsubscribe.decorator';
import { ConfigurationService } from '../../configuration/configuration.service';
import { PullRequestsService } from '../../pull-requests/pull-requests.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
@AutoUnsubscribe()
export class AccountComponent implements OnInit {

  @Input() account: Account;

  constructor(private accountService: AccountService,
              private dialogService: DialogsService,
              private spinnerService: SpinnerService,
              private snackBar: MdSnackBar,
	      private configurationService: ConfigurationService,
              private pullRequestsService: PullRequestsService) { }

  ngOnInit() {
  }

  /**
   * Remove an existing account.
   * @param account The account to disconnect.
   */
  removeAccount(account: Account): void {
    this.dialogService.confirm('Confirm Remove', 'Are you sure you want to disconnect this account?')
        .filter(res => res)
        .do(() => this.spinnerService.showSpinner())
        .toPromise()
        .then(() => {
	  this.performRemoveAccount(account);
	  this.configurationService.refreshConnectedRepositories();
          this.pullRequestsService.refreshPullRequestList();
	});
  }

  private performRemoveAccount(account: Account) {
    this.accountService.removeAccount(account)
        .do(() => this.spinnerService.hideSpinner())
        .do(() => this.snackBar.open('Account successfully removed', null, { duration: 2000 }))
        .toPromise()
        .then(() => console.log('finiched'));
  }
}
