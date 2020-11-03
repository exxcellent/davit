import React, {FunctionComponent, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {DataCTO} from '../../../../../../dataAccess/access/cto/DataCTO';
import {DataInstanceTO} from '../../../../../../dataAccess/access/to/DataInstanceTO';
import {DataSetupTO} from '../../../../../../dataAccess/access/to/DataSetupTO';
import {InitDataTO} from '../../../../../../dataAccess/access/to/InitDataTO';
import {EditActions, editSelectors} from '../../../../../../slices/EditSlice';
import {handleError} from '../../../../../../slices/GlobalSlice';
import {masterDataSelectors} from '../../../../../../slices/MasterDataSlice';
import {Carv2Util} from '../../../../../../utils/Carv2Util';
import {Carv2ButtonIcon, Carv2ButtonLabel} from '../../../../../common/fragments/buttons/Carv2Button';
import {Carv2DeleteButton} from '../../../../../common/fragments/buttons/Carv2DeleteButton';
import {ActorDropDown} from '../../../../../common/fragments/dropdowns/ActorDropDown';
import {DataAndInstanceId, InstanceDropDown} from '../../../../../common/fragments/dropdowns/InstanceDropDown';
import {ControllPanelEditSub} from '../common/ControllPanelEditSub';
import {OptionField} from '../common/OptionField';

export interface ControllPanelEditInitDataProps {
  hidden: boolean;
}

export const ControllPanelEditInitData: FunctionComponent<ControllPanelEditInitDataProps> = (props) => {
  const {hidden} = props;
  const {
    label,
    saveInitData,
    deleteInitData,
    data,
    actor,
    setActorId,
    setInstance,
    createAnother,
    key,
    // getInstances,
  } = useControllPanelEditDataSetupViewModel();

  return (
    <ControllPanelEditSub label={label} key={key} hidden={hidden} onClickNavItem={saveInitData}>
      <div className="optionFieldSpacer">
        <OptionField label="Select Actor to which data will be added">
          <ActorDropDown
            onSelect={(actor) => (actor ? setActorId(actor.actor.id) : setActorId(-1))}
            placeholder="Select Actor..."
            onBlur={() => {}}
            value={actor}
          />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Select Data which will be added">
          <InstanceDropDown onSelect={setInstance} value={data} />
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild" style={{paddingLeft: '10px', paddingRight: '10px'}}>
        <div>
          <OptionField label="Navigation">
            <Carv2ButtonLabel onClick={createAnother} label="Create another" />
            <Carv2ButtonIcon onClick={saveInitData} icon="reply" />
          </OptionField>
        </div>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="options">
          <Carv2DeleteButton onClick={deleteInitData} />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditDataSetupViewModel = () => {
  const initDataToEdit: InitDataTO | null = useSelector(editSelectors.initDataToEdit);
  const dataSetup: DataSetupTO | null = useSelector(
      masterDataSelectors.getDataSetupToById(initDataToEdit?.dataSetupFk || -1),
  );
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  const dispatch = useDispatch();
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    // check if sequence to edit is really set or gos back to edit mode
    if (initDataToEdit === null) {
      handleError('Tried to go to edit initData without initDataToedit specified');
      dispatch(EditActions.setMode.edit());
    }
    // used to focus the textfield on create another
  }, [dispatch, initDataToEdit]);

  const saveInitData = (newMode?: string) => {
    if (initDataToEdit !== null) {
      console.info(initDataToEdit);
      if (
        initDataToEdit !== null
        && initDataToEdit?.actorFk !== -1
        && initDataToEdit?.dataFk !== -1
        && initDataToEdit?.instanceFk !== -1
        && initDataToEdit?.dataSetupFk !== -1
      ) {
        dispatch(EditActions.initData.save(initDataToEdit));
      } else {
        deleteInitData();
      }
      if (newMode && newMode === 'EDIT') {
        dispatch(EditActions.setMode.edit());
      } else {
        dispatch(EditActions.setMode.editDataSetup(initDataToEdit?.dataSetupFk));
      }
    }
  };

  const deleteInitData = () => {
    if (initDataToEdit !== null) {
      dispatch(EditActions.initData.delete(initDataToEdit.id));
      dispatch(EditActions.setMode.editDataSetup(initDataToEdit.dataSetupFk));
    }
  };

  const setActorId = (id: number) => {
    if (initDataToEdit !== null) {
      const copyInitDataToEdit: InitDataTO = Carv2Util.deepCopy(initDataToEdit);
      copyInitDataToEdit.actorFk = id;
      dispatch(EditActions.initData.update(copyInitDataToEdit));
    }
  };

  const setInstance = (dataAndInstanceId: DataAndInstanceId | undefined): void => {
    if (dataAndInstanceId !== undefined) {
      const copyInitDataToEdit: InitDataTO = Carv2Util.deepCopy(initDataToEdit);
      copyInitDataToEdit.dataFk = dataAndInstanceId.dataFk;
      copyInitDataToEdit.instanceFk = dataAndInstanceId.instanceId;
      dispatch(EditActions.initData.update(copyInitDataToEdit));
    }
  };

  const createAnother = () => {
    saveInitData();
    createInitData();
    setKey(key + 1);
  };

  const createInitData = () => {
    if (initDataToEdit !== null) {
      const initData: InitDataTO = new InitDataTO();
      initData.dataSetupFk = initDataToEdit.dataSetupFk;
      dispatch(EditActions.setMode.editInitData(initData));
    }
  };

  const getInstances = () => {
    let instances: DataInstanceTO[] = [];
    if (initDataToEdit !== null && datas !== null) {
      const data = datas.find((data) => data.data.id === initDataToEdit.dataFk);
      if (data) {
        instances = data.data.instances;
      }
    }
    return instances;
  };

  return {
    label: 'EDIT * ' + (dataSetup?.name || '') + ' * INIT DATA',
    data: JSON.stringify({
      dataFk: initDataToEdit?.dataFk,
      instanceId: initDataToEdit?.instanceFk,
    }),
    getInstances,
    actor: initDataToEdit?.actorFk,
    deleteInitData,
    saveInitData,
    setActorId,
    setInstance,
    createAnother,
    key,
  };
};
