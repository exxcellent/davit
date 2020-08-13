import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DecisionTO } from "../../../../../../dataAccess/access/to/DecisionTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon } from "../../../../../common/fragments/buttons/Carv2Button";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { MultiselectDataDropDown } from "../../../../../common/fragments/dropdowns/MultiselectDataDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditConditionProps {}

export const ControllPanelEditCondition: FunctionComponent<ControllPanelEditConditionProps> = (props) => {
  const {
    label,
    setModeEditDecision,
    componentFk,
    setComponentFk,
    getDecision,
    setHas,
    setData,
    dataFks,
  } = useControllPanelEditConditionViewModel();

  const hasDropDown = (
    <OptionField label="Codition">
      <Dropdown
        options={[
          { key: 1, value: 1, text: "has" },
          { key: 2, value: 2, text: "has not" },
        ]}
        compact
        selection
        selectOnBlur={false}
        onChange={(event, data) => setHas(data.value as number)}
        value={getDecision()}
      />
    </OptionField>
  );

  return (
    <ControllPanelEditSub label={label}>
      <div className="controllPanelEditChild">
        <OptionField label="Select Component">
          <ComponentDropDown value={componentFk} onSelect={(comp) => setComponentFk(comp?.component.id || -1)} />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">{hasDropDown}</div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Select data for component">
          <MultiselectDataDropDown
            onSelect={(data) => {
              setData(data);
            }}
            selected={dataFks || []}
          />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Navigation">
          <Carv2ButtonIcon onClick={setModeEditDecision} icon="reply" />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditConditionViewModel = () => {
  const decisionToEdit: DecisionTO | null = useSelector(editSelectors.decisionToEdit);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isNullOrUndefined(decisionToEdit)) {
      dispatch(handleError("Tried to go to edit decision without decisionToEdit specified"));
      dispatch(EditActions.setMode.edit());
    }
  }, [dispatch, decisionToEdit]);

  const setData = (dataIds: number[] | undefined) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      const copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.dataFks = dataIds || [];
      dispatch(EditActions.decision.save(copyDecisionToEdit));
      dispatch(EditActions.decision.update(copyDecisionToEdit));
    }
  };

  const setModeEditDecision = () => {
    console.info("click set edit decision!");
    if (!isNullOrUndefined(decisionToEdit)) {
      console.info("decisionToEdit is not null!");
      dispatch(EditActions.setMode.editDecision(decisionToEdit));
    } else {
      console.info("decisionToEdit is null!");
    }
  };

  const setComponentFk = (compId: number) => {
    if (!isNullOrUndefined(decisionToEdit)) {
      let copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.componentFk = compId;
      dispatch(EditActions.decision.save(copyDecisionToEdit));
      dispatch(EditActions.decision.update(copyDecisionToEdit));
    }
  };

  // This is workaround sins redux seams to have a problem to save boolean values.
  const getDecision = (): number => {
    let hasNumber: number = 2;
    if (!isNullOrUndefined(decisionToEdit)) {
      hasNumber = decisionToEdit.has ? 1 : 2;
    }
    return hasNumber;
  };

  const setHas = (setHas: number | undefined) => {
    if (!isNullOrUndefined(decisionToEdit) && !isNullOrUndefined(setHas)) {
      let copyDecisionToEdit: DecisionTO = Carv2Util.deepCopy(decisionToEdit);
      copyDecisionToEdit.has = setHas === 1 ? true : false;
      dispatch(EditActions.decision.save(copyDecisionToEdit));
      dispatch(EditActions.decision.update(copyDecisionToEdit));
    }
  };

  return {
    label: "EDIT * SEQUENCE * DECISION * CONDITION",
    setModeEditDecision,
    componentFk: decisionToEdit?.componentFk,
    setComponentFk,
    getDecision,
    setHas,
    setData,
    dataFks: decisionToEdit?.dataFks,
  };
};
