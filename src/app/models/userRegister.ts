export class UserRegister {
    UserName: string = '';
    Password: string = '';
    EmailAddress: string = '';
    FirstName: string = '';
    LastName: string = '';
    isCreator: boolean = false;
  
    constructor(init?: Partial<UserRegister>) {
      Object.assign(this, init);
    }
  }