import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationTO, Direction, RelationType } from "../../../../../../dataAccess/access/to/DataRelationTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { masterDataSelectors } from "../../../../../../slices/MasterDataSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2SubmitCancelCheckBox } from "../common/fragments/Carv2SubmitCancel";

export interface ControllPanelEditRelationProps {}

export const ControllPanelEditRelation: FunctionComponent<ControllPanelEditRelationProps> = (props) => {
  const {
    label,
    label1,
    label2,
    data1,
    data2,
    direction1,
    direction2,
    type1,
    type2,
    setLabel,
    setType,
    setDirection,
    setData,
    saveRelation,
    deleteRelation,
    cancel,
    toggleIsCreateAnother,
    showDelete,
    dataOptions,
    directionOptions,
    typeOptions,
    validRelation,
    key,
    isCreateAnother,
  } = useControllPanelEditRelationViewModel();

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Dropdown
              placeholder="Select Data1"
              selection
              selectOnBlur={false}
              options={dataOptions}
              onChange={(event, data) => {
                setData(Number(data.value));
              }}
              value={data1}
            />
            <Dropdown
              placeholder="Select Type1"
              selection
              options={typeOptions}
              onChange={(event: any) => setType(event.target.value)}
              value={type1}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Input placeholder="Label1" onChange={(event: any) => setLabel(event.target.value)} value={label1} />
            <Dropdown
              placeholder="Select Direction1"
              selection
              options={directionOptions}
              onChange={(event, data) => setDirection(Direction[data.value as Direction])}
              value={direction1}
            />
          </div>
        </div>
      </div>
      <div className="columnDivider" style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Dropdown
              placeholder="Select Data2"
              selection
              selectOnBlur={false}
              options={dataOptions}
              onChange={(event, data) => {
                setData(Number(data.value), true);
              }}
              value={data2}
            />
            <Dropdown
              placeholder="Select Type2"
              selection
              options={typeOptions}
              onChange={(event: any) => setType(event.target.value, true)}
              value={type2}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Input placeholder="Label2" onChange={(event: any) => setLabel(event.target.value, true)} value={label2} />
            <Dropdown
              placeholder="Select Direction2"
              selection
              options={directionOptions}
              onChange={(event, data) => setDirection(Direction[data.value as Direction], true)}
              value={direction2}
            />
          </div>
        </div>
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancelCheckBox
          onSubmit={saveRelation}
          onChange={toggleIsCreateAnother}
          onCancel={cancel}
          submitCondition={validRelation()}
          checked={isCreateAnother}
        />
      </div>
      {showDelete && (
        <div className="columnDivider">
          <div className="controllPanelEditChild" style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Carv2DeleteButton onClick={deleteRelation} />
          </div>
        </div>
      )}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditRelationViewModel = () => {
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  const relationToEdit: DataRelationTO | null = useSelector(editSelectors.relationToEdit);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
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
    dispatch(EditActions.relation.save(relationToEdit!));
    if (isCreateAnother) {
      setKey(key + 1);
      dispatch(EditActions.setMode.editRelation());
    } else {
      dispatch(EditActions.setMode.edit());
    }
  };

  const deleteRelation = () => {
    dispatch(EditActions.relation.delete(relationToEdit!));
    dispatch(EditActions.setMode.edit());
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
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    showDelete: relationToEdit?.id !== -1,
    dataOptions: datas.map(dataToOption),
    directionOptions,
    typeOptions,
    validRelation,
    key,
    isCreateAnother,
  };
};
