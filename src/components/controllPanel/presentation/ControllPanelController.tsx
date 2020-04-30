import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Message, Transition } from "semantic-ui-react";
import {
  Mode,
  selectGlobalErrorState,
  selectGlobalModeState,
} from "../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../viewModel/ControllPanelActions";
import { ControllPanelMetaComponentOptions } from "./fragments/ControllPanelMetaComponentOptions";
import { ControllPanelSequenceOptions } from "./fragments/ControllPanelSequenceOptions";

export interface ControllPanelProps {}

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (
  props
) => {
  const errorMessages: string[] = useSelector(selectGlobalErrorState);
  const mode: Mode = useSelector(selectGlobalModeState);

  const dispatch = useDispatch();

  return (
    <div>
      {mode === Mode.VIEW && <ControllPanelSequenceOptions />}
      {mode === Mode.EDIT && <ControllPanelMetaComponentOptions />}
      <Transition
        visible={errorMessages.length > 0}
        animate="slide down"
        duration={1000}
      >
        <Message error>
          <Message.Header>Error</Message.Header>
          <Button
            icon="close"
            size="mini"
            onClick={() => dispatch(ControllPanelActions.clearErrors())}
          />
          {errorMessages}
        </Message>
      </Transition>
    </div>
  );
};
