import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { sequenceModelSelectors } from "../../../slices/SequenceModelSlice";

interface SequenceTableModelControllerProps {}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (props) => {
  const { title, getTableBody } = useSequenceTableViewModel();

  return (
    <div className="sequenceTable">
      <div style={{ display: "flex", justifyContent: "center", width: "100%", color: "white" }}>
        <label>{title}</label>
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
        <tbody className="carv2TBody">{getTableBody()}</tbody>
      </table>
    </div>
  );
};

interface RowProps {
  index: number;
  name: string;
  sender: string;
  receiver: string;
}

const useSequenceTableViewModel = () => {
  const sequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const selectedStep: SequenceStepCTO | null = useSelector(sequenceModelSelectors.selectCurrentStep);

  const createStepColumn = (step: SequenceStepCTO): JSX.Element => {
    const trClass: string = selectedStep?.squenceStepTO.id === step.squenceStepTO.id ? "carv2TrMarked" : "carv2Tr";
    return (
      <tr key={step.squenceStepTO.id} className={trClass}>
        <td className="carv2Td">{step.squenceStepTO.index}</td>
        <td className="carv2Td">{step.squenceStepTO.name}</td>
        <td className="carv2Td">{getComponentNameById(step.squenceStepTO.sourceComponentFk)}</td>
        <td className="carv2Td">{getComponentNameById(step.squenceStepTO.targetComponentFk)}</td>
      </tr>
    );
  };

  const getTableBody = () => {
    let list: JSX.Element[] = [];
    if (sequence) {
      sequence.sequenceStepCTOs.forEach((step) => {
        list.push(createStepColumn(step));
      });
    }
    while (list.length > 10) {
      list.push(<tr> </tr>);
    }
    return list;
  };

  const getComponentNameById = (id: number): string => {
    return components.find((comp) => comp.component.id === id)?.component.name || "Could not find Component!";
  };

  return {
    title: sequence ? sequence.sequenceTO.name : "Select Sequence ...",
    // tableBody: sequence?.sequenceStepCTOs.map(createStepColumn),
    getTableBody,
  };
};
