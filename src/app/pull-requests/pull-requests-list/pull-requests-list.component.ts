import { Component, OnInit } from '@angular/core';
import { PullRequest } from '../pull-request';
import { PullRequestsService } from '../pull-requests.service';
import { SpinnerService } from '../../shared/providers/spinner.service';
import { AutoUnsubscribe } from '../../shared/auto-unsubscribe/auto-unsubscribe.decorator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pull-requests-list',
  templateUrl: './pull-requests-list.component.html',
  styleUrls: ['./pull-requests-list.component.scss']
})
@AutoUnsubscribe()
export class PullRequestsListComponent implements OnInit {

  private pullRequests: PullRequest[];
  private pullRequestsSubscription: Subscription;

  constructor(private pullRequestService: PullRequestsService,
              private spinnerService: SpinnerService) { }

  ngOnInit() {

    this.spinnerService.showSpinner();

    // Subscribe to the pull requests list.
    this.pullRequestsSubscription = this.pullRequestService.getPullRequests()
                                        .filter(pullRequests => !!pullRequests)
                                        .do(() => this.spinnerService.hideSpinner())
                                        .subscribe(
        (pullRequests) => this.pullRequests = pullRequests,
        (error) => console.log(error)
      );
  }

}
