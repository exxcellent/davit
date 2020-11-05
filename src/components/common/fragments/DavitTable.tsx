import React, {FunctionComponent} from "react";
import {Carv2TableButton} from '../../../components/common/fragments/buttons/Carv2TableButton';

interface DavitTableProps{
    header: string[],
    bodyData: DavitTableRowData[];
    addFunction?: ()=>void;
    tableHeight: string;
}

interface DavitTableRowData{
    data: string[],
    trClass: string,
    editFunction?: ()=>void;
    selectFunction?: ()=> void;
}

export const DavitTable: FunctionComponent<DavitTableProps> = (props) => {
    const {header, bodyData, addFunction, tableHeight} = props;

    const mapValue = (value, index) => {
        return (
            <td id={index.toString()}>{value}</td>
        )
    }

    const createButton = (icon: string, callback: ()=>void) => {
        return (
        <td>
          <Carv2TableButton
            icon={icon}
            onClick={callback}
          />
        </td> 
        )
    }

    const createRow = (data,index) => {
        return (
            <tr key={index} className={data.trClass}>
                {data.data.map(mapValue)}
                {data.editFunction && createButton('wrench', data.editFunction)}
                {data.editFunction && createButton('hand pointer', data.selectFunction)}
            </tr>)
    }

    const createHeader = (value,index) => {
        return <th key={index}>{value}</th>;
    }

    return (
         <table>
        <thead>
          <tr>
            {header.map(createHeader)}
          </tr>
        </thead>
        <tbody style={{ height: tableHeight }}>
            {bodyData.map(createRow)}
            {addFunction && <tr><td>{createButton('add', addFunction)}</td></tr>}
        </tbody>
      </table>
    )
}