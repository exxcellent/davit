import { isNullOrUndefined } from "util";

export const Carv2Util = {
  deepCopy(object: any) {
    return isNullOrUndefined(object) ? object : JSON.parse(JSON.stringify(object));
  },

  isValidName(name: string): boolean {
    const nameRegExp: RegExp = /^[A-Za-z0-9_./-]+$/;
    let valid: boolean = false;
    if (!isNullOrUndefined(name)) {
      if (!isNullOrUndefined(name)) {
        valid = nameRegExp.test(name);
      }
    }
    return valid;
  },
};
