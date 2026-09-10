import {
  animals,
  colors,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator";

export class Companion {
  id: string;
  name: string;
  birthdate: number;

  constructor() {
    const randomName: string = uniqueNamesGenerator({
      dictionaries: [names],
    });
    const color: string = uniqueNamesGenerator({
      dictionaries: [colors],
    });
    const animal: string = uniqueNamesGenerator({
      dictionaries: [animals],
    });

    this.id = crypto.randomUUID();
    this.name = `${randomName} ${color.charAt(0).toUpperCase() + color.slice(1)}-${animal.charAt(0).toUpperCase() + animal.slice(1)}`;
    this.birthdate = Date.now();
  }

  sayHello(): string {
    const response = `Bonjour, je m'appelle ${this.name}. Je suis né(e) le ${new Date(this.birthdate).toLocaleDateString()} à ${new Date(this.birthdate).toLocaleTimeString()}.`;
    alert(response);
    console.log(this);
    return response;
  }
}
