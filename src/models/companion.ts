import { names, uniqueNamesGenerator } from "unique-names-generator";

export class Companion {
  id: string;
  name: string;
  birthdate: number;

  constructor() {
    const randomName: string = uniqueNamesGenerator({
      dictionaries: [names],
    });

    this.id = crypto.randomUUID();
    this.name = randomName;
    this.birthdate = Date.now();
  }

  sayHello(): string {
    const response = `Hello, my name is ${this.name}. I was born on ${new Date(this.birthdate).toLocaleDateString()} at ${new Date(this.birthdate).toLocaleTimeString()}.`;
    console.log(response);
    return response;
  }
}
