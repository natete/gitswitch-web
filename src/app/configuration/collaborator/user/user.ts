export class User {
  id: number;
  fullname: string;
  username: string;
  photoUrl: string;
  email: string;
  type: string;

  constructor(user: any = {}) {
    this.id = user.id;
    this.fullname = user.fullname;
    this.username = user.username;
    this.photoUrl = user.photoUrl;
    this.email = user.email;
    this.photoUrl = user.photoUrl;
  }
}
