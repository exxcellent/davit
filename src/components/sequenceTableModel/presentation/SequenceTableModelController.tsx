import React, { FunctionComponent, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table } from "semantic-ui-react";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { currentSequence, currentStep } from "../../../slices/SequenceSlice";

interface SequenceTableModelControllerProps {}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (props) => {
  const sequence: SequenceCTO | null = useSelector(currentSequence);
  const selectedStep: SequenceStepCTO | null = useSelector(currentStep);
  const [selectedId, setSelectedId] = React.useState<number>(-1);

  useEffect(() => {
    if (selectedStep !== null) {
      setSelectedId(selectedStep.squenceStepTO.id);
    } else {
      setSelectedId(-1);
    }
  }, [selectedStep]);

  const createTableRow = (sequenceStepCTO: SequenceStepCTO) => {
    return (
      <Table.Row
        id={sequenceStepCTO.squenceStepTO.index}
        active={selectedId === sequenceStepCTO.squenceStepTO.id}
        key={sequenceStepCTO.squenceStepTO.index}
      >
        <Table.Cell>{sequenceStepCTO.squenceStepTO.index}</Table.Cell>
        <Table.Cell>{sequenceStepCTO.squenceStepTO.name}</Table.Cell>
        <Table.Cell>{sequenceStepCTO.componentCTOSource.component.name}</Table.Cell>
        <Table.Cell>{sequenceStepCTO.componentCTOTarget.component.name}</Table.Cell>
      </Table.Row>
    );
  };

  const createRowPlaceholder = (index: number) => {
    return (
      <Table.Row id={index} key={index}>
        <Table.Cell textAlign="center">{index}</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    );
  };

  const createTable = (sequence: SequenceCTO | null) => {
    if (sequence !== null) {
      return sequence.sequenceStepCTOs.map(createTableRow);
    } else {
      const placeholder: number[] = Array.from(Array(10).keys());
      return placeholder.map(createRowPlaceholder);
    }
  };

  return (
    <div className="sequenceTable">
      {sequence && (
        <div style={{ display: "flex", justifyContent: "center", width: "100%", color: "white" }}>
          <label>{sequence.sequenceTO.name}</label>
        </div>
      )}
      <Table celled inverted collapsing={false}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ width: "15px" }}>Nr.</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Sender</Table.HeaderCell>
            <Table.HeaderCell>Receiver</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{createTable(sequence)}</Table.Body>
      </Table>
    </div>
  );
};
