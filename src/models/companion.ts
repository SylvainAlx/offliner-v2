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

  sayHello(): string {
    return `Bonjour, je m'appelle ${this.name}. J'ai été invoqué le ${new Date(this.birthdate).toLocaleDateString()} à ${new Date(this.birthdate).toLocaleTimeString()}.`;
  }
}
