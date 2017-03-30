export class Account {
  id: number;
  fullname: string;
  username: string;
  email: string;
  type: string;
  photoUrl: string;
  repoNumber: number;
  organization: string;
  location: string;
  account_id: number;

  constructor(account: any = {}) {
      this.id = account.id;
      this.username = account.username;
      this.fullname = account.fullname;
      this.email = account.email;
      this.photoUrl = account.photoUrl;
      this.repoNumber = account.repoNumber;
      this.type = account.type || 'github';
      this.organization = account.organization;
      this.location = account.location;
      this.account_id = account.account_id;
  }
}
