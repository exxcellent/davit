
export const Carv2Util = {
  
    isNullOrUndefined<T>(object: T | null | undefined): boolean{
      return object === null || undefined ? true : false;
    },

  deepCopy(object: any) {
    return this.isNullOrUndefined(object) ? object : JSON.parse(JSON.stringify(object));
  },

  isValidName(name: string): boolean {
    let valid: boolean = false;
    if (!this.isNullOrUndefined(name)) {
      valid = name.length < 13 && name.length > 0;
    }
    return valid;
  },
};
