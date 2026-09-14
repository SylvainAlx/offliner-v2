import { names, animals, uniqueNamesGenerator } from "unique-names-generator";

export class Companion {
  id: string;
  name: string;
  birthdate: number;

  constructor() {
    const firstName: string = uniqueNamesGenerator({
      dictionaries: [names],
    });
    const lastName: string = uniqueNamesGenerator({
      dictionaries: [animals],
      style: "capital",
    });

    this.id = crypto.randomUUID();
    this.name = `${firstName} ${lastName}`;
    this.birthdate = Date.now();
  }

  sayHello(): void {
    const response = `Bonjour, je m'appelle ${this.name}. Je suis né(e) le ${new Date(this.birthdate).toLocaleDateString()} à ${new Date(this.birthdate).toLocaleTimeString()}.`;
    alert(response);
    console.log(this);
  }
}
