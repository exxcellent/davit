
export const Carv2Util = {

  isNullOrUndefined(object: any): boolean {
    return object === null || object === undefined;
  },

  deepCopy(object: any) {
    return Carv2Util.isNullOrUndefined(object) ? object : JSON.parse(JSON.stringify(object));
  },

  isValidName(name: string): boolean {
    let valid: boolean = false;
    if (!this.isNullOrUndefined(name)) {
      valid = name.length < 13 && name.length > 0;
    }
    return valid;
  },
};
