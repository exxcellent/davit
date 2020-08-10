import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationTO, Direction, RelationType } from "../../../../../../dataAccess/access/to/DataRelationTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { masterDataSelectors } from "../../../../../../slices/MasterDataSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditRelationProps {}

export const ControllPanelEditRelation: FunctionComponent<ControllPanelEditRelationProps> = (props) => {
  const {
    label,
    data1,
    data2,
    direction1,
    direction2,
    setDirection,
    setData,
    saveRelation,
    deleteRelation,
    dataOptions,
    directionOptions,
    createAnother,
    key,
    updateRelation,
  } = useControllPanelEditRelationViewModel();

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div className="optionField">
        <OptionField label="Select first relation data">
          <Dropdown
            placeholder="Select Data..."
            selection
            selectOnBlur={false}
            options={dataOptions}
            onChange={(event, data) => {
              setData(Number(data.value));
            }}
            value={data1}
            onBlur={() => updateRelation()}
          />
        </OptionField>

        <OptionField label="Select line ''out'' direction">
          <Dropdown
            placeholder="Select Direction1"
            selection
            options={directionOptions}
            onChange={(event, data) => setDirection(Direction[data.value as Direction])}
            value={direction1}
            onBlur={() => updateRelation()}
          />
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <div className="optionField">
          <OptionField label="Select second relation data">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Dropdown
                placeholder="Select Data..."
                selection
                selectOnBlur={false}
                options={dataOptions}
                onChange={(event, data) => {
                  setData(Number(data.value), true);
                }}
                value={data2}
                onBlur={() => updateRelation()}
              />
            </div>
          </OptionField>
          <OptionField label="Selct line ''in'' direction">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Dropdown
                placeholder="Select Direction2"
                selection
                options={directionOptions}
                onChange={(event, data) => setDirection(Direction[data.value as Direction], true)}
                value={direction2}
                onBlur={() => updateRelation()}
              />
            </div>
          </OptionField>
        </div>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <div>
          <OptionField label="Navigation">
            <Carv2ButtonLabel onClick={createAnother} label="Create another" />
            <Carv2ButtonIcon onClick={saveRelation} icon="reply" />
          </OptionField>
        </div>
      </div>
      <div className="columnDivider">
        <div className="controllPanelEditChild" style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <OptionField label="Relation options">
            <Carv2DeleteButton onClick={deleteRelation} />
          </OptionField>
        </div>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditRelationViewModel = () => {
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  const relationToEdit: DataRelationTO | null = useSelector(editSelectors.relationToEdit);
  const dispatch = useDispatch();
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    // check if component to edit is really set or go back to edit mode
    if (isNullOrUndefined(relationToEdit)) {
      dispatch(EditActions.setMode.edit());
      handleError("Tried to go to edit relation without relationToedit specified");
    }
  }, [relationToEdit, dispatch]);

  const dataToOption = (data: DataCTO): DropdownItemProps => {
    return {
      key: data.data.id,
      text: data.data.name,
      value: data.data.id,
    };
  };

  const setData = (dataId: number, isSnd?: boolean) => {
    const relationCopy: DataRelationTO = Carv2Util.deepCopy(relationToEdit);
    isSnd ? (relationCopy.data2Fk = dataId) : (relationCopy.data1Fk = dataId);
    dispatch(EditActions.setMode.editRelation(relationCopy));
  };

  const setLabel = (label: string, isSnd?: boolean) => {
    const relationCopy: DataRelationTO = Carv2Util.deepCopy(relationToEdit);
    isSnd ? (relationCopy.label2 = label) : (relationCopy.label1 = label);
    dispatch(EditActions.setMode.editRelation(relationCopy));
  };

  const setDirection = (direction: Direction, isSnd?: boolean) => {
    const relationCopy: DataRelationTO = Carv2Util.deepCopy(relationToEdit);
    isSnd ? (relationCopy.direction2 = direction) : (relationCopy.direction1 = direction);
    dispatch(EditActions.setMode.editRelation(relationCopy));
  };

  const setType = (relationType: RelationType, isSnd?: boolean) => {
    const relationCopy: DataRelationTO = Carv2Util.deepCopy(relationToEdit);
    isSnd ? (relationCopy.type2 = relationType) : (relationCopy.type1 = relationType);
    dispatch(EditActions.setMode.editRelation(relationCopy));
  };

  const saveRelation = () => {
    if (relationToEdit?.data1Fk !== -1 && relationToEdit?.data2Fk !== -1) {
      dispatch(EditActions.relation.save(relationToEdit!));
    } else {
      deleteRelation();
    }
    dispatch(EditActions.setMode.edit());
  };

  const deleteRelation = () => {
    dispatch(EditActions.relation.delete(relationToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const updateRelation = () => {
    let copyRelationToEdit: DataRelationTO = Carv2Util.deepCopy(relationToEdit);
    dispatch(EditActions.relation.save(copyRelationToEdit));
  };

  const createAnother = () => {
    setKey(key + 1);
    dispatch(EditActions.setMode.editRelation());
  };

  const directionOptions = Object.entries(Direction).map(([key, value]) => ({
    key: key,
    text: key,
    value: value,
  }));

  const typeOptions = Object.entries(RelationType).map(([key, value]) => ({
    key: key,
    text: key,
    value: value,
  }));

  const validRelation = (): boolean => {
    let valid: boolean = false;
    if (!isNullOrUndefined(relationToEdit)) {
      valid = relationToEdit.data1Fk !== -1 && relationToEdit.data2Fk !== -1;
    }
    return valid;
  };

  return {
    label: relationToEdit?.id === -1 ? "ADD RELATION" : "EDIT RELATION",
    label1: relationToEdit?.label1,
    label2: relationToEdit?.label2,
    data1: relationToEdit?.data1Fk === -1 ? undefined : relationToEdit?.data1Fk,
    data2: relationToEdit?.data2Fk === -1 ? undefined : relationToEdit?.data2Fk,
    direction1: relationToEdit?.direction1,
    direction2: relationToEdit?.direction2,
    type1: relationToEdit?.type1,
    type2: relationToEdit?.type2,
    setLabel,
    setType,
    setDirection,
    setData,
    saveRelation,
    deleteRelation,
    cancel: () => dispatch(EditActions.setMode.edit()),
    dataOptions: datas.map(dataToOption),
    directionOptions,
    typeOptions,
    validRelation,
    key,
    createAnother,
    updateRelation,
  };
};
