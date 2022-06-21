export class User {

    constructor(
        public firstName: string,
        public lastName: string,
        public phone: string,
        public email:string,
        public role:string,
        public status?: string,
        public userId?:string
      ) {}
}