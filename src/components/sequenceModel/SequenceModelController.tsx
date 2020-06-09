import React, { FunctionComponent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SequenceActions } from "../../slices/SequenceSlice";

interface SequenceModelControllerProps {}

export const SequenceModelController: FunctionComponent<SequenceModelControllerProps> = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(SequenceActions.loadSequencesFromBackend());
  }, [dispatch]);

  return <div className="sequencModel"></div>;
};
