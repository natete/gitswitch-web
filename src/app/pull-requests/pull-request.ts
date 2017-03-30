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
  from_repo_id: number;
  from_repo_name: string;
  to_repo_id: number;
  to_repo_name: string;
  type: string;
  updated: string;

  constructor(pullRequest: any = {}) {
      this.title = pullRequest.title;
      this.id = pullRequest.id;
      this.description = pullRequest.description;
      this.username = pullRequest.username;
      this.date = pullRequest.date;
      this.commits = pullRequest.commits;
      this.comments = pullRequest.comments;
      this.from = pullRequest.from;
      this.to = pullRequest.to;
      this.from_repo_id = pullRequest.from_repo_id;
      this.from_repo_name = pullRequest.from_repo_name;
      this.to_repo_id = pullRequest.to_repo_id;
      this.to_repo_name = pullRequest.to_repo_name;
      this.type = pullRequest.type;
      this.updated = pullRequest.update;
  }
}
