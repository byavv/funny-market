export class User {
    token: string;
    name:string;
    constructor(name?:string, token?: string) {
        this.token = token;
        this.name = name;
    }
    isAuthenticated() {
        return !!this.token;
    }
} 