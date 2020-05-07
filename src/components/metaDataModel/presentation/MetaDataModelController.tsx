import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { MetaDataActions } from "../viewModel/MetaDataActions";
import { selectDatas } from "../viewModel/MetaDataModelSlice";
import { MetaDataDnDBox } from "./fragments/MetaDataDnDBox";

interface MetaDataModelControllerProps {}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (
  props
) => {
  const datas: DataCTO[] = useSelector(selectDatas);
  //   const selectedStep: SequenceStepCTO | undefined = useSelector(selectStep);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(MetaDataActions.findAllDatas());
  }, [dispatch]);

  //   const createNewComponent = () => {
  //     dispatch(MetaComponentActions.saveComponent(new ComponentCTO()));
  //   };

  const saveData = (dataCTO: DataCTO) => {
    dispatch(MetaDataActions.saveData(dataCTO));
  };

  //   const deleteComp = (id: number) => {
  //     const componentToDelete: ComponentCTO | undefined = components.find(
  //       (component) => component.component.id === id
  //     );
  //     if (componentToDelete) {
  //       dispatch(MetaComponentActions.deleteComponent(componentToDelete));
  //     }
  //   };

  const createMetaDataDnDBox = () => {
    return (
      <MetaDataDnDBox
        dataCTOs={datas}
        onSaveCallBack={saveData}
        // onDeleteCallBack={deleteComp}
        // step={selectedStep}
      />
    );
  };

  return createMetaDataDnDBox();
};
