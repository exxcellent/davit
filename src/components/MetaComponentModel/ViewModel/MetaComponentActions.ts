import { AppThunk } from "../../../app/store";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataAccess } from "../../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../../dataAccess/DataAccessResponse";
import { handleError } from "../../common/viewModel/GlobalSlice";
import { metaComponentModelSlice } from "./MetaComponentModelSlice";

const { loadComponents } = metaComponentModelSlice.actions;

const findAllComponents = (): AppThunk => async (dispatch) => {
  console.info("Called Slice findAll function");
  const response: DataAccessResponse<
    ComponentCTO[]
  > = await DataAccess.findAllComponents();
  if (response.code === 200) {
    dispatch(loadComponents(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveComponent = (component: ComponentCTO): AppThunk => async (
  dispatch
) => {
  console.info("Called Slice save function");
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.saveComponentCTO(
    component
  );
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllComponents());
  } else {
    dispatch(handleError(response.message));
  }
};

const deleteComponent = (component: ComponentCTO): AppThunk => async (
  dispatch
) => {
  console.info("Called Slice delete function");
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.deleteComponentCTO(
    component
  );
  console.log(response);
  if (response.code === 200) {
    dispatch(findAllComponents());
  } else {
    dispatch(handleError(response.message));
  }
};

export const MetaComponentActions = {
  findAllComponents: findAllComponents,
  saveComponent: saveComponent,
  deleteComponent: deleteComponent,
};
