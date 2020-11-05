import {Carv2Util} from '../../utils/Carv2Util';

export const CheckHelper = {
  nullCheck(object: any, name: string) {
    if (Carv2Util.isNullOrUndefined(object)) {
      console.warn(`${name} must not be null or undefined`);
      throw new Error(`null.error! ${name} must not be null or undefined`);
    }
  },
};
