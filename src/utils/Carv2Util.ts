import { isNullOrUndefined } from "util";

export const Carv2Util = {
  deepCopy(object: any) {
    return isNullOrUndefined(object)
      ? object
      : JSON.parse(JSON.stringify(object));
  },
};
