import { isNullOrUndefined } from "util";
import { useIntl } from "react-intl";

export class CheckHelper {
  static nullCheck = (object: any, name: string) => {
    let intl = useIntl();
    if (isNullOrUndefined(object)) {
      console.warn(`${name} must not be null or undefined`);
      throw new Error(
        intl.formatMessage({ id: "null.error" }, { object: object })
      );
    }
  };
}
