import { DataAndInstanceId } from '../../../components/common/fragments/dropdowns/InstanceDropDown';
import { GoToChain, GoToTypesChain } from '../types/GoToTypeChain';
import { AbstractTO } from './AbstractTO';

export class ChainDecisionTO extends AbstractTO {
  constructor(
    public name: string = "",
    public chainFk: number = -1,
    public has: boolean = true,
    public componentFk: number = -1,
    public dataAndInstaceIds: DataAndInstanceId[] = [],
    public ifGoTo: GoToChain = { type: GoToTypesChain.FIN },
    public elseGoTo: GoToChain = { type: GoToTypesChain.ERROR }
  ) {
    super();
  }
}
