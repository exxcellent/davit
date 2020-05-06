import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Message, Transition } from "semantic-ui-react";
import { globalSlice, selectGlobalErrorState } from "../viewModel/GlobalSlice";

export interface ErrorNotificationProps {}

export const ErrorNotification: FunctionComponent<ErrorNotificationProps> = (
  props
) => {
  const errorMessages: string[] = useSelector(selectGlobalErrorState);
  const dispatch = useDispatch();
  const { clearErrors } = globalSlice.actions;

  return (
    <div className="notificationPanel">
      <Transition
        visible={errorMessages.length > 0}
        animate="slide up"
        duration={1000}
      >
        <Message error compact>
          <Message.Header>Error</Message.Header>
          <Button
            icon="close"
            size="mini"
            onClick={() => dispatch(clearErrors())}
          />
          {errorMessages}
        </Message>
      </Transition>
    </div>
  );
};
