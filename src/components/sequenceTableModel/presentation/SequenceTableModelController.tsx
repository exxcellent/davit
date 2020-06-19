import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { currentSequence, currentStep } from "../../../slices/SequenceSlice";

interface SequenceTableModelControllerProps {}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (props) => {
  const sequence: SequenceCTO | null = useSelector(currentSequence);
  const selectedStep: SequenceStepCTO | null = useSelector(currentStep);

  const createStepColumn = (step: SequenceStepCTO) => {
    const trClass: string = selectedStep?.squenceStepTO.id === step.squenceStepTO.id ? "carv2TrMarked" : "carv2Tr";
    return (
      <tr key={step.squenceStepTO.id} className={trClass}>
        <td className="carv2Td">{step.squenceStepTO.index}</td>
        <td className="carv2Td">{step.squenceStepTO.name}</td>
        <td className="carv2Td">{step.componentCTOSource.component.name}</td>
        <td className="carv2Td">{step.componentCTOTarget.component.name}</td>
      </tr>
    );
  };

  return (
    <div className="sequenceTable">
      <div style={{ display: "flex", justifyContent: "center", width: "100%", color: "white" }}>
        <label>{sequence?.sequenceTO.name ? sequence?.sequenceTO.name : "Select Sequence..."}</label>
      </div>
      <table className="carv2Table">
        <thead>
          <tr>
            <th className="carv2Th" style={{ width: "15px" }}>
              INDEX
            </th>
            <th className="carv2Th">NAME</th>
            <th className="carv2Th">SENDER</th>
            <th className="carv2Th">RECEIVER</th>
          </tr>
        </thead>
        <tbody className="carv2TBody">{sequence?.sequenceStepCTOs.map(createStepColumn)}</tbody>
      </table>
    </div>
  );
};
