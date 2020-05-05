import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Table } from "semantic-ui-react";
import { ComponentDataCTO } from "../../../dataAccess/access/cto/ComponentDataCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { selectSequence } from "../../common/viewModel/GlobalSlice";

interface SequenceTableModelControllerProps {}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = () => {
  const sequence: SequenceCTO | undefined = useSelector(selectSequence);

  const createTableRow = (sequenceStepCTO: SequenceStepCTO) => {
    return (
      <Table.Row id={sequenceStepCTO.squenceStepTO.id}>
        <Table.Cell>{sequenceStepCTO.squenceStepTO.name}</Table.Cell>
        <Table.Cell>
          {sequenceStepCTO.componentCTOSource.component.name}
        </Table.Cell>
        <Table.Cell>
          {sequenceStepCTO.componentCTOTarget.component.name}
        </Table.Cell>
        <Table.Cell>
          {sequenceStepCTO.componentDataCTOs.map(createDataNameLabel)}
        </Table.Cell>
      </Table.Row>
    );
  };

  const createDataNameLabel = (componentDataCTO: ComponentDataCTO) => {
    return <label>{componentDataCTO.dataTO.name}, </label>;
  };

  return (
    <Table celled>
      <Table.Header>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Sender</Table.HeaderCell>
        <Table.HeaderCell>Receiver</Table.HeaderCell>
        <Table.HeaderCell>Data</Table.HeaderCell>
      </Table.Header>
      <Table.Body>{sequence?.sequenceStepCTOs.map(createTableRow)}</Table.Body>
    </Table>
  );
};
