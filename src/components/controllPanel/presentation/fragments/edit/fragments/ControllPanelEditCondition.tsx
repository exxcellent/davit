import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ConditionTO } from "../../../../../../dataAccess/access/to/ConditionTO";
import { GoTo, GoToTypes } from "../../../../../../dataAccess/access/types/GoToType";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { sequenceModelSelectors } from "../../../../../../slices/SequenceModelSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { ConditionDropDown } from "../../../../../common/fragments/dropdowns/ConditionDropDown";
import { GoToOptionDropDown } from "../../../../../common/fragments/dropdowns/GoToOptionDropDown";
import { MultiselectDataDropDown } from "../../../../../common/fragments/dropdowns/MultiselectDataDropDown";
import { StepDropDown } from "../../../../../common/fragments/dropdowns/StepDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditConditionProps {}

export const ControllPanelEditCondition: FunctionComponent<ControllPanelEditConditionProps> = (props) => {
  const {
    label,
    name,
    changeName,
    saveCondition,
    textInput,
    setComponent,
    updateCondition,
    deleteCondition,
    compId,
    setData,
    datas,
    setHas,
    handleType,
    ifGoTo,
    elseGoTo,
    setGoToTypeStep,
    setGoToTypeCondition,
    createGoToStep,
    createGoToCondition,
    setRoot,
    isRoot,
    getCondition,
    key,
  } = useControllPanelEditConditionViewModel();

  const conditionName = (
    <OptionField>
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Condition Name ..."
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
        onBlur={() => updateCondition()}
      />
    </OptionField>
  );

  const hasDropDown = (
    <Dropdown
      options={[
        { key: 1, value: 1, text: "has" },
        { key: 2, value: 2, text: "not" },
      ]}
      compact
      selection
      selectOnBlur={false}
      onChange={(event, data) => setHas(data.value as number)}
      value={getCondition()}
    />
  );

  const dropDowns = (
    <div className="optionFieldSpacer columnDivider">
      <OptionField>
        <ComponentDropDown
          onSelect={(comp) => {
            setComponent(comp);
            updateCondition();
          }}
          value={compId}
          compact
        />
      </OptionField>
      <MultiselectDataDropDown
        onSelect={(data) => {
          setData(data);
          updateCondition();
        }}
        selected={datas}
      />
    </div>
  );

  const menuButtons = (
    <div className="columnDivider controllPanelEditChild">
      <Carv2ButtonLabel onClick={setRoot} label={isRoot ? "Root" : "Set as Root"} disable={isRoot} />
      <Carv2ButtonLabel onClick={saveCondition} label="OK" />
      <OptionField>
        <Carv2DeleteButton onClick={deleteCondition} />
      </OptionField>
    </div>
  );

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div className="controllPanelEditChild">
        {conditionName}
        {hasDropDown}
      </div>
      {dropDowns}
      <div className="columnDivider controllPanelEditChild">
        <OptionField>
          <GoToOptionDropDown onSelect={(gt) => handleType(true, gt)} value={ifGoTo ? ifGoTo.type : GoToTypes.ERROR} />
          {ifGoTo!.type === GoToTypes.STEP && (
            <>
              <Carv2ButtonIcon icon="add" onClick={() => createGoToStep(true)} />
              <StepDropDown
                onSelect={(step) => setGoToTypeStep(true, step)}
                value={ifGoTo?.type === GoToTypes.STEP ? ifGoTo.id : 1}
              />
            </>
          )}
          {ifGoTo!.type === GoToTypes.COND && (
            <>
              <Carv2ButtonIcon icon="add" onClick={() => createGoToCondition(true)} />
              <ConditionDropDown
                onSelect={(cond) => setGoToTypeCondition(true, cond)}
                value={ifGoTo?.type === GoToTypes.COND ? ifGoTo.id : 1}
              />
            </>
          )}
        </OptionField>
        <OptionField>
          <GoToOptionDropDown
            onSelect={(gt) => handleType(false, gt)}
            value={elseGoTo ? elseGoTo.type : GoToTypes.ERROR}
          />
          {elseGoTo!.type === GoToTypes.STEP && (
            <>
              <Carv2ButtonIcon icon="add" onClick={() => createGoToStep(false)} />
              <StepDropDown
                onSelect={(step) => setGoToTypeStep(false, step)}
                value={elseGoTo?.type === GoToTypes.STEP ? elseGoTo.id : 1}
              />
            </>
          )}
          {elseGoTo!.type === GoToTypes.COND && (
            <>
              <Carv2ButtonIcon icon="add" onClick={() => createGoToCondition(false)} />
              <ConditionDropDown
                onSelect={(cond) => setGoToTypeCondition(false, cond)}
                value={elseGoTo?.type === GoToTypes.COND ? elseGoTo.id : 1}
              />
            </>
          )}
        </OptionField>
      </div>
      {menuButtons}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditConditionViewModel = () => {
  const conditionToEdit: ConditionTO | null = useSelector(editSelectors.conditionToEdit);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);
  const [currentIfGoTo, setCurrentIfGoTo] = useState<GoTo>({ type: GoToTypes.STEP, id: -1 });
  const [currentElseGoTo, setCurrentElseGoTo] = useState<GoTo>({ type: GoToTypes.STEP, id: -1 });
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    if (isNullOrUndefined(conditionToEdit)) {
      console.warn(conditionToEdit);
      dispatch(handleError("Tried to go to edit condition step without conditionToEdit specified"));
      dispatch(EditActions.setMode.edit());
    }
    if (conditionToEdit) {
      setCurrentIfGoTo(conditionToEdit.ifGoTo);
      setCurrentElseGoTo(conditionToEdit.elseGoTo);
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dispatch, conditionToEdit]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(conditionToEdit)) {
      const copyConditionToEdit: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
      copyConditionToEdit.name = name;
      dispatch(EditActions.setMode.editCondition(copyConditionToEdit));
    }
  };

  const setComponent = (component: ComponentCTO | undefined) => {
    if (component !== undefined && !isNullOrUndefined(conditionToEdit)) {
      const copyConditionToEdit: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
      copyConditionToEdit.componentFk = component.component.id;
      dispatch(EditActions.setMode.editCondition(copyConditionToEdit));
    }
  };

  const setData = (dataIds: number[] | undefined) => {
    if (!isNullOrUndefined(conditionToEdit)) {
      const copyConditionToEdit: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
      copyConditionToEdit.dataFks = dataIds || [];
      dispatch(EditActions.setMode.editCondition(copyConditionToEdit));
    }
  };

  const saveCondition = () => {
    if (!isNullOrUndefined(conditionToEdit) && !isNullOrUndefined(selectedSequence)) {
      dispatch(EditActions.condition.save(conditionToEdit));
      // if (isEditNext) {
      //   if (stepToEdit.squenceStepTO.index < selectedSequence.sequenceStepCTOs.length) {
      //     dispatch(
      //       EditActions.setMode.editStep(
      //         selectedSequence.sequenceStepCTOs.find(
      //           (step) => step.squenceStepTO.id === stepToEdit.squenceStepTO.index + 1
      //         )
      //       )
      //     );
      //   } else {
      //     dispatch(EditActions.setMode.editStep());
      //   }
      // } else {
      dispatch(EditActions.setMode.editSequence(conditionToEdit.sequenceFk));
      // }
    }
  };

  const deleteCondition = () => {
    if (!isNullOrUndefined(conditionToEdit) && !isNullOrUndefined(selectedSequence)) {
      dispatch(EditActions.condition.delete(conditionToEdit, selectedSequence));
      dispatch(EditActions.setMode.editSequence(conditionToEdit.sequenceFk));
    }
  };

  const updateCondition = () => {
    const copyCondition: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
    dispatch(EditActions.condition.save(copyCondition));
  };

  const validStep = (): boolean => {
    let valid: boolean = false;
    if (!isNullOrUndefined(conditionToEdit)) {
      if (
        conditionToEdit.name !== ""
        // TODO: for condition development purpose.
        // && stepToEdit.squenceStepTO.sourceComponentFk !== -1 &&
        // stepToEdit.squenceStepTO.targetComponentFk !== -1
      ) {
        valid = true;
      }
    }
    return valid;
  };

  const saveGoToType = (ifGoTo: Boolean, goTo: GoTo) => {
    if (goTo !== undefined) {
      const copyConditionToEdit: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
      ifGoTo ? (copyConditionToEdit.ifGoTo = goTo) : (copyConditionToEdit.elseGoTo = goTo);
      dispatch(EditActions.condition.update(copyConditionToEdit));
      dispatch(EditActions.condition.save(copyConditionToEdit));
    }
  };

  const handleType = (ifGoTo: Boolean, newGoToType?: string) => {
    if (newGoToType !== undefined) {
      const gType = { type: (GoToTypes as any)[newGoToType] };
      ifGoTo ? setCurrentIfGoTo(gType) : setCurrentElseGoTo(gType);
      switch (newGoToType) {
        case GoToTypes.ERROR:
          saveGoToType(ifGoTo, gType);
          break;
        case GoToTypes.FIN:
          saveGoToType(ifGoTo, gType);
          break;
      }
    }
  };

  const setHas = (setHas: number | undefined) => {
    console.info("has: ", setHas);
    if (!isNullOrUndefined(conditionToEdit) && !isNullOrUndefined(setHas)) {
      let copyConditionToEdit: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
      copyConditionToEdit.has = setHas === 1 ? true : false;
      dispatch(EditActions.setMode.editCondition(copyConditionToEdit));
    }
  };

  const setGoToTypeStep = (ifGoTo: Boolean, step?: SequenceStepCTO) => {
    if (step) {
      let newGoTo: GoTo = { type: GoToTypes.STEP, id: step.squenceStepTO.id };
      saveGoToType(ifGoTo, newGoTo);
    }
  };

  const setGoToTypeCondition = (ifGoTo: Boolean, condition?: ConditionTO) => {
    if (condition) {
      let newGoTo: GoTo = { type: GoToTypes.COND, id: condition.id };
      saveGoToType(ifGoTo, newGoTo);
    }
  };

  const createGoToStep = (ifGoTo: Boolean) => {
    if (!isNullOrUndefined(conditionToEdit)) {
      let goToStep: SequenceStepCTO = new SequenceStepCTO();
      goToStep.squenceStepTO.sequenceFk = conditionToEdit.sequenceFk;
      const copyCondition: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
      dispatch(EditActions.setMode.editStep(goToStep, copyCondition, ifGoTo));
    }
  };

  const createGoToCondition = (ifGoTo: Boolean) => {
    if (!isNullOrUndefined(conditionToEdit)) {
      let goToCondition: ConditionTO = new ConditionTO();
      goToCondition.sequenceFk = conditionToEdit.sequenceFk;
      const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(conditionToEdit);
      dispatch(EditActions.setMode.editCondition(goToCondition, copyStepToEdit, ifGoTo));
      setKey(key + 1);
    }
  };

  const setRoot = () => {
    if (!isNullOrUndefined(conditionToEdit)) {
      let copySequence: SequenceCTO = Carv2Util.deepCopy(selectedSequence);
      copySequence.sequenceStepCTOs.map((step) => (step.squenceStepTO.root = false));
      copySequence.conditions.map((cond) => (cond.root = false));
      copySequence.sequenceStepCTOs.forEach((step) => dispatch(EditActions.step.save(step)));
      copySequence.conditions.forEach((cond) => dispatch(EditActions.condition.save(cond)));
      let copyConditionToEdit: ConditionTO = Carv2Util.deepCopy(conditionToEdit);
      copyConditionToEdit.root = true;
      dispatch(EditActions.condition.save(copyConditionToEdit));
      dispatch(EditActions.condition.update(copyConditionToEdit));
    }
  };

  // This is workaround sins redux seams to have a problem to save boolean values.
  const getCondition = (): number => {
    let hasNumber: number = 2;
    if (!isNullOrUndefined(conditionToEdit)) {
      hasNumber = conditionToEdit.has ? 1 : 2;
    }
    return hasNumber;
  };

  return {
    label: "EDIT CONDITION",
    name: conditionToEdit?.name,
    changeName,
    saveCondition,
    setComponent,
    textInput,
    validStep,
    compId: conditionToEdit?.componentFk,
    updateCondition,
    deleteCondition,
    setData,
    datas: conditionToEdit?.dataFks || [],
    setHas,
    handleType,
    setGoToTypeStep,
    setGoToTypeCondition,
    ifGoTo: currentIfGoTo,
    elseGoTo: currentElseGoTo,
    createGoToStep,
    createGoToCondition,
    setRoot,
    isRoot: conditionToEdit?.root ? conditionToEdit.root : false,
    getCondition,
    key,
  };
};
