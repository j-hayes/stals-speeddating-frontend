export class Account {
  allFieldsFilledOut():boolean {
    return this.firstName !== '' &&
     this.lastName !== '' &&
     this.email !== '' &&
     this.age  > 0 &&
     this.minDateAge > 0 &&
     this.maxDateAge > 0 &&
     this.sex !== '' &&
     this.password !== '';
    }
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    age: number = 0;
    password: string = '';
    sex: string = '';
    Id: string = '';
    minDateAge: number = 0;
    maxDateAge: number = 0;
}