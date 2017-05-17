import { DatePipe } from '@angular/common';
export class PullRequest {
  title: string;
  description: string;
  username: string;
  date: string;
  commits: number;
  comments: number;
  id: number;
  from: string;
  to: string;

  constructor(datePipe: DatePipe, pullRequest?: any) {
    if (pullRequest) {
      this.title = pullRequest.title;
      this.id = pullRequest.id;
      this.description = pullRequest.description;
      this.username = pullRequest.username;
      this.date = datePipe.transform(new Date(pullRequest.date), 'shortDate');
      this.commits = pullRequest.commits;
      this.comments = pullRequest.comments;
      this.from = pullRequest.from;
      this.to = `${pullRequest.to_repo_name}/${pullRequest.to}`;
    }
  }
}