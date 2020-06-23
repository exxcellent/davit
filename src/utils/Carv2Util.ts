import { isNullOrUndefined } from "util";

export const Carv2Util = {
  deepCopy(object: any) {
    return isNullOrUndefined(object) ? object : JSON.parse(JSON.stringify(object));
  },

  isValidName(name: string): boolean {
    let valid: boolean = false;
    if (!isNullOrUndefined(name)) {
      valid = name.length < 13 && name.length > 0;
    }
    return valid;
  },
};
