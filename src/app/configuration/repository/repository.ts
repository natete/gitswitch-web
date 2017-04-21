import { Collaborator } from '../collaborator/collaborator';

export class Repository {
  id: number;
  name: string;
  type: string;
  username: string;
  accountId: number;
  canAdmin: boolean;
  age: string;
  updated: string;
  language: string;
  issues: number;
  collaborators: Collaborator[];

  constructor(repository: any = {}) {
      this.id = repository.id;
    this.name = repository.name;
    this.type = repository.type;
      this.username = repository.username;
    this.accountId = repository.accountId;
    this.canAdmin = repository.canAdmin;
    this.age = repository.age;
    this.updated = repository.updated;
    this.language = repository.language;
    this.issues = repository.fullname;
    this.collaborators = repository.collaborators || [];
  }
}
