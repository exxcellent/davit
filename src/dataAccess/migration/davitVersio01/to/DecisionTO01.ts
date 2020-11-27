import { DataAndInstanceId } from '../../../../components/common/fragments/dropdowns/InstanceDropDown';
import { AbstractTO } from '../../../access/to/AbstractTO';
import { GoTo, GoToTypes } from '../../../access/types/GoToType';

export class DecisionTO01 extends AbstractTO {
    constructor(
        public name: string = '',
        public sequenceFk: number = -1,
        public actorFk: number = -1,
        public dataAndInstaceId: DataAndInstanceId = { dataFk: -1, instanceId: -1 },
        public ifGoTo: GoTo = { type: GoToTypes.FIN },
        public elseGoTo: GoTo = { type: GoToTypes.ERROR },
        public root: boolean = false,
    ) {
        super();
    }
}
