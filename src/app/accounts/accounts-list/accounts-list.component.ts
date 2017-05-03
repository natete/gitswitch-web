import { Component, OnInit } from '@angular/core';
import { Account } from '../account';
import { AccountService } from '../account.service';
import { DialogsService } from '../../shared/dialogs/dialogs.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { SpinnerService } from '../../shared/providers/spinner.service';
import 'rxjs/add/operator/do';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit {

  private accounts: Account[];
  private addAccountSubscription: Subscription;
  private getAccountsSubscription: Subscription;
  private dialogSubscription: Subscription;

  constructor(private accountService: AccountService,
              private activatedRoute: ActivatedRoute,
              private spinnerService: SpinnerService,
              private snackBar: MdSnackBar,
              private dialogService: DialogsService) { }

  ngOnInit() {

    this.spinnerService.showSpinner();

    // Capture de URL parameters to check if we are coming back from
    // authorizing a new git account.
    this.addAccountSubscription = this.activatedRoute.queryParams
                                      .filter((params: Params) => params['code'] && params['state'])
                                      .map((params: Params) => ({
                                        code: params['code'],
                                        nonce: params['state'],
                                        type: params['account']
                                      }))
                                      .flatMap(params => (this.accountService.authorizeAccount(params.code, params.nonce, params.type)))
                                      .do(() => this.spinnerService.hideSpinner())
                                      .subscribe(() => this.snackBar.open('Account successfully added', null, { duration: 2000 } as MdSnackBarConfig));

    // Get the list of accounts
    this.getAccountsSubscription = this.accountService.getAccounts()
                                       .filter(accounts => !!accounts)
                                       .do(() => this.spinnerService.hideSpinner())
                                       .subscribe(
                                         (accounts) => this.accounts = accounts,
                                         (error) => this.spinnerService.hideSpinner()
                                       );
  }

  /**
   * Add a new account.
   */
  addAccountGitHub(): void {
    this.spinnerService.showSpinner();
    this.accountService.addAccountGitHub();
  }

  addAccountGitLab(): void {
    this.spinnerService.showSpinner();
    this.accountService.addAccountGitLab();
  }

  selectAccount(): void {
    this.dialogSubscription = this.dialogService.select('Select Git Source', 'Please select a git service', 'GitHub', 'GitLab')
                                  .map(res => res)
                                  .subscribe(data => data === 'GitHub' ? this.addAccountGitHub() : this.addAccountGitLab());
  }
}
