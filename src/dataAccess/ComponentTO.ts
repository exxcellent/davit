export type ComponentJson = {
  name: string;
  id: number;
  geometricalDataFk: number;
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
    this.json.geometricalDataFk = geomatricalDataFk;
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
    readonly geometricalDataFk: number,
    readonly designFk: number
  ) {}

  toJSON(): ComponentJson {
    return {
      name: this.name,
      id: this.id,
      geometricalDataFk: this.geometricalDataFk,
      designFk: this.designFk,
    };
  }

  static fromJSON(json: ComponentJson): ComponentTO {
    return new ComponentTO(
      json.name,
      json.id,
      json.geometricalDataFk,
      json.designFk
    );
  }
  static builder(component?: ComponentTO): ComponentBuilder {
    return new ComponentBuilder(component);
  }
}
