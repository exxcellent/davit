import React, { FunctionComponent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MasterDataActions } from "../../slices/MasterDataSlice";

interface SequenceModelControllerProps {}

export const SequenceModelController: FunctionComponent<SequenceModelControllerProps> = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(MasterDataActions.loadSequencesFromBackend());
  }, [dispatch]);

  return <div className="sequencModel"></div>;
};
