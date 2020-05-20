import React, { FunctionComponent, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table } from "semantic-ui-react";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { selectSequence, selectStep } from "../../common/viewModel/GlobalSlice";

interface SequenceTableModelControllerProps {}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (
  props
) => {
  const sequence: SequenceCTO | undefined = useSelector(selectSequence);
  const selectedStep: SequenceStepCTO | undefined = useSelector(selectStep);

  const [selectedId, setSelectedId] = React.useState<number>(-1);

  useEffect(() => {
    if (selectedStep !== undefined) {
      setSelectedId(selectedStep.squenceStepTO.id);
    } else {
      setSelectedId(-1);
    }
  }, [selectedStep]);

  const createTableRow = (sequenceStepCTO: SequenceStepCTO) => {
    return (
      <Table.Row
        id={sequenceStepCTO.squenceStepTO.id}
        active={selectedId === sequenceStepCTO.squenceStepTO.id}
      >
        <Table.Cell>{sequenceStepCTO.squenceStepTO.id}</Table.Cell>
        <Table.Cell>{sequenceStepCTO.squenceStepTO.name}</Table.Cell>
        <Table.Cell>
          {sequenceStepCTO.componentCTOSource.component.name}
        </Table.Cell>
        <Table.Cell>
          {sequenceStepCTO.componentCTOTarget.component.name}
        </Table.Cell>
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

  const createTable = (sequence: SequenceCTO | undefined) => {
    if (sequence !== undefined) {
      return sequence.sequenceStepCTOs.map(createTableRow);
    } else {
      const placeholder: number[] = Array.from(Array(10).keys());
      return placeholder.map(createRowPlaceholder);
    }
  };

  return (
    <div className="sequenceTable">
      <Table celled inverted>
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
