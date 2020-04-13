export type ComponentJson = {
  name: string;
  id: number;
  geomatricalDataFk: number;
  designFk: number;
};

export class ComponentBuilder {
  private json: ComponentJson;

  constructor(component?: ComponentTO) {
    this.json = component ? component.toJSON() : ({} as ComponentJson);
  }
  name(name: string): ComponentBuilder {
    this.json.name = name;
    return this;
  }
  id(id: number): ComponentBuilder {
    this.json.id = id;
    return this;
  }
  designFk(designFk: number): ComponentBuilder {
    this.json.designFk = designFk;
    return this;
  }
  geomatricalDataFk(geomatricalDataFk: number): ComponentBuilder {
    this.json.geomatricalDataFk = geomatricalDataFk;
    return this;
  }
  build(): ComponentTO {
    return ComponentTO.fromJSON(this.json);
  }
}

export default class ComponentTO {
  private constructor(
    readonly name: string,
    readonly id: number,
    readonly geomatricalDataFk: number,
    readonly designFk: number
  ) {}

  toJSON(): ComponentJson {
    return {
      name: this.name,
      id: this.id,
      geomatricalDataFk: this.geomatricalDataFk,
      designFk: this.designFk,
    };
  }

  static fromJSON(json: ComponentJson): ComponentTO {
    return new ComponentTO(
      json.name,
      json.id,
      json.geomatricalDataFk,
      json.designFk
    );
  }
  static builder(component?: ComponentTO): ComponentBuilder {
    return new ComponentBuilder(component);
  }
}
