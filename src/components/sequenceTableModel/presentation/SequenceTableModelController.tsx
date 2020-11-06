/* eslint-disable react/display-name */
import React, {FunctionComponent, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {isNullOrUndefined} from 'util';
import {Carv2TableButton} from '../../../components/common/fragments/buttons/Carv2TableButton';
import {ChainlinkCTO} from '../../../dataAccess/access/cto/ChainlinkCTO';
import {SequenceCTO} from '../../../dataAccess/access/cto/SequenceCTO';
import {SequenceStepCTO} from '../../../dataAccess/access/cto/SequenceStepCTO';
import {ChainDecisionTO} from '../../../dataAccess/access/to/ChainDecisionTO';
import {ChainTO} from '../../../dataAccess/access/to/ChainTO';
import {DataSetupTO} from '../../../dataAccess/access/to/DataSetupTO';
import {DecisionTO} from '../../../dataAccess/access/to/DecisionTO';
import {SequenceTO} from '../../../dataAccess/access/to/SequenceTO';
import {GoTo, GoToTypes, Intermediate} from '../../../dataAccess/access/types/GoToType';
import {GoToChain, GoToTypesChain, IntermediateChain} from '../../../dataAccess/access/types/GoToTypeChain';
import {CalcChain, CalcChainLink} from '../../../services/SequenceChainService';
import {CalculatedStep} from '../../../services/SequenceService';
import {EditActions, editSelectors, Mode} from '../../../slices/EditSlice';
import {masterDataSelectors} from '../../../slices/MasterDataSlice';
import {SequenceModelActions, sequenceModelSelectors} from '../../../slices/SequenceModelSlice';
import {DavitTable} from '../../common/fragments/DavitTable';
import {TabFragment} from '../fragments/TabFragment';
import {TabGroupFragment} from '../fragments/TabGroupFragment';
import {useGetCalcSequenceTableData} from '../tables/CalcSequence';
import {useGetSequenceModelsTableBody} from '../tables/ModelSequence';
import {useGetStepTableData} from '../tables/ModelSequenceStep';

interface SequenceTableModelControllerProps {
  fullScreen?: boolean;
}

enum ActiveTab {
  step = 'step',
  decision = 'decision',
  sequence = 'sequence',
  chain = 'chain',
  chainlinks = 'chainlinks',
  chaindecisions = 'chaindecisions',
  sequenceModels = 'sequenceModels',
  chainModel = 'chainModels',
  dataSetup = 'dataSetup',
}

export const SequenceTableModelController: FunctionComponent<SequenceTableModelControllerProps> = (
    props,
) => {
  const {fullScreen} = props;
  const {
    getDecisionTableBody,
    getChainTableBody,
    getChainDecisionTableBody,
    getChainLinkTableBody,
    getChainModelsTableBody,
    getDataSetupTableBody,
    showChainModelTab,
    showSequenceModelTabs,
    showCalcChainTab,
    showCalcSequenceTab,
    activeTab,
    setActiveTab,

    modelSequenceData,
    modelSequenceStepData,
    calcSequenceData,
  } = useSequenceTableViewModel();

  const createTable = (headerValues: string[], body: JSX.Element[]) => {
    return (
      <table>
        <thead>
          <tr>
            {headerValues.map((value, index) => {
              return <th key={index}>{value}</th>;
            })}
          </tr>
        </thead>
        <tbody style={{height: tableHeight}}>{body}</tbody>
      </table>
    );
  };

  const chainTableHead = ['INDEX', 'NAME', 'SEQUENCE', 'DATASETUP'];
  const chaindecisionsTableHead = ['NAME', 'IF GOTO', 'ELSE GOTO', 'ACTIONS'];
  const chainlinkTableHead = [
    'NAME',
    'SEQUENCE',
    'DATASETUP',
    'GOTO',
    'ACTIONS',
    'START',
  ];
  const seqeunceDcisionsTableHead = [
    'NAME',
    'IF GOTO',
    'ELSE GOTO',
    'ACTIONS',
    'START',
  ];

  const chainModelTableHead = ['NAME', 'ACTIONS'];
  const dataSetupTableHead = ['NAME', 'ACTIONS'];

  const getTabsKey = () => {
    let key = showCalcChainTab ? 'chain' : '';
    key += showSequenceModelTabs ? 'seqModel' : '';
    key += showChainModelTab ? 'chainModel' : '';
    key += showCalcSequenceTab ? 'seq' : '';
    return key;
  };

  const parentRef = useRef<HTMLDivElement>(null);

  const [tableHeight, setTabelHeihgt] = useState<number>(0);

  useEffect(() => {
    const resizeListener = () => {
      if (parentRef && parentRef.current) {
        setTabelHeihgt(parentRef.current.offsetHeight - 120);
      }
    };

    resizeListener();
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [parentRef]);

  return (
    <div className={fullScreen ? '' : 'sequenceTable'} ref={parentRef}>
      <div className="tableBorder">
        <div className="tabs" key={getTabsKey()}>
          {(showCalcChainTab || showCalcSequenceTab) && (
            <TabGroupFragment label="Calculated">
              {showCalcChainTab && (
                <TabFragment
                  label="Chain"
                  isActive={activeTab === ActiveTab.chain}
                  onClick={() => setActiveTab(ActiveTab.chain)}
                />
              )}
              {showCalcSequenceTab && (
                <TabFragment
                  label="Sequence"
                  isActive={activeTab === ActiveTab.sequence}
                  onClick={() => setActiveTab(ActiveTab.sequence)}
                />
              )}
            </TabGroupFragment>
          )}
          {showChainModelTab && (
            <TabGroupFragment label="Chain Model">
              <TabFragment
                label="Decision"
                isActive={activeTab === ActiveTab.chaindecisions}
                onClick={() => setActiveTab(ActiveTab.chaindecisions)}
              />
              <TabFragment
                label="Links"
                isActive={activeTab === ActiveTab.chainlinks}
                onClick={() => setActiveTab(ActiveTab.chainlinks)}
              />
            </TabGroupFragment>
          )}
          {showSequenceModelTabs && (
            <TabGroupFragment label="Sequence Model">
              <TabFragment
                label="Decision"
                isActive={activeTab === ActiveTab.decision}
                onClick={() => setActiveTab(ActiveTab.decision)}
              />
              <TabFragment
                label="Steps"
                isActive={activeTab === ActiveTab.step}
                onClick={() => setActiveTab(ActiveTab.step)}
              />
            </TabGroupFragment>
          )}
          <TabGroupFragment label="Models">
            <TabFragment
              label="Chain"
              isActive={activeTab === ActiveTab.chainModel}
              onClick={() => setActiveTab(ActiveTab.chainModel)}
            />
            <TabFragment
              label="Sequence"
              isActive={activeTab === ActiveTab.sequenceModels}
              onClick={() => setActiveTab(ActiveTab.sequenceModels)}
            />
            <TabFragment
              label="Data Setup"
              isActive={activeTab === ActiveTab.dataSetup}
              onClick={() => setActiveTab(ActiveTab.dataSetup)}
            />
          </TabGroupFragment>
        </div>

        {activeTab === ActiveTab.chain
          && createTable(chainTableHead, getChainTableBody())}
        {activeTab === ActiveTab.chaindecisions
          && createTable(chaindecisionsTableHead, getChainDecisionTableBody())}
        {activeTab === ActiveTab.chainlinks
          && createTable(chainlinkTableHead, getChainLinkTableBody())}
        {activeTab === ActiveTab.step
          && <DavitTable {...modelSequenceStepData} tableHeight={tableHeight}/>}
        {activeTab === ActiveTab.decision
          && createTable(seqeunceDcisionsTableHead, getDecisionTableBody())}

        {activeTab === ActiveTab.sequence
          && <DavitTable {...calcSequenceData} tableHeight={tableHeight}/>}

        {activeTab === ActiveTab.sequenceModels
          && <DavitTable {...modelSequenceData} tableHeight={tableHeight}/>}
        {activeTab === ActiveTab.chainModel
          && createTable(chainModelTableHead, getChainModelsTableBody())}
        {activeTab === ActiveTab.dataSetup
          && createTable(dataSetupTableHead, getDataSetupTableBody())}
      </div>
    </div>
  );
};

const useSequenceTableViewModel = () => {
  const dispatch = useDispatch();
  const selectSequence: SequenceCTO | null = useSelector(
      sequenceModelSelectors.selectSequence,
  );

  const chainIndex: number | null = useSelector(
      sequenceModelSelectors.selectCurrentLinkIndex,
  );
  const calcSteps: CalculatedStep[] = useSelector(
      sequenceModelSelectors.selectCalcSteps,
  );

  const calcChain: CalcChain | null = useSelector(
      sequenceModelSelectors.selectCalcChain,
  );
  const sequences: SequenceTO[] = useSelector(masterDataSelectors.sequences);
  const dataSetups: DataSetupTO[] = useSelector(masterDataSelectors.dataSetup);
  const selectedChain: ChainTO | null = useSelector(
      sequenceModelSelectors.selectChain,
  );
  const chainModles: ChainTO[] = useSelector(masterDataSelectors.chains);
  const mode: Mode = useSelector(editSelectors.mode);
  const selectedChainlinks: ChainlinkCTO[] = useSelector(
      sequenceModelSelectors.selectCurrentChainLinks,
  );
  const selectedChainDecisions: ChainDecisionTO[] = useSelector(
      sequenceModelSelectors.selectCurrentChainDecisions,
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.sequence);

  useEffect(() => {
    let newActiveTab: ActiveTab | undefined = undefined;
    switch (mode) {
      case Mode.VIEW:
        if (selectedChain) {
          newActiveTab = ActiveTab.chain;
        } else {
          newActiveTab = ActiveTab.sequence;
        }
        break;
      case Mode.EDIT_CHAIN:
        newActiveTab = ActiveTab.chainModel;
        break;
      case Mode.EDIT_CHAIN_DECISION:
      case Mode.EDIT_CHAIN_DECISION_CONDITION:
        newActiveTab = ActiveTab.chaindecisions;
        break;
      case Mode.EDIT_SEQUENCE:
        newActiveTab = ActiveTab.sequenceModels;
        break;
      case Mode.EDIT_SEQUENCE_DECISION:
      case Mode.EDIT_SEQUENCE_DECISION_CONDITION:
        newActiveTab = ActiveTab.decision;
        break;
      case Mode.EDIT_SEQUENCE_STEP:
      case Mode.EDIT_SEQUENCE_STEP_ACTION:
        newActiveTab = ActiveTab.step;
        break;
    }
    if (newActiveTab) {
      setActiveTab(newActiveTab);
    }
  }, [mode, selectedChain]);

  const createChainModelColumn = (
      chain: ChainTO,
      index: number,
  ): JSX.Element => {
    const name = chain.name;
    const trClass = 'carv2Tr';
    return (
      <tr key={index} className={trClass}>
        <td>{name}</td>
        <td>
          <Carv2TableButton
            icon="wrench"
            onClick={() => dispatch(EditActions.setMode.editChain(chain))}
          />
          <Carv2TableButton
            icon="hand pointer"
            onClick={() => {
              dispatch(SequenceModelActions.setCurrentChain(chain));
              dispatch(EditActions.setMode.view());
            }}
          />
        </td>
      </tr>
    );
  };

  const createCalcLinkColumn = (
      link: CalcChainLink,
      index: number,
  ): JSX.Element => {
    const name: string = link.name || 'Link name not found!';
    const sequenceName: string
      = link.sequence.sequenceModel?.sequenceTO.name
      || 'Sequence name not found!';
    const dataSetupName: string
      = link.dataSetup.dataSetup?.name || 'Data setup name not found!';
    let trClass = 'carv2Tr';
    if (index === chainIndex) {
      trClass = 'carv2TrMarked';
    }
    return (
      <tr
        key={index}
        className={'clickable ' + trClass}
        onClick={() => handleChainTableClickEvent(index)}
      >
        <td>{index + 1}</td>
        <td>{name}</td>
        <td>{sequenceName}</td>
        <td>{dataSetupName}</td>
      </tr>
    );
  };

  const createDecisionColumn = (
      decision: DecisionTO,
      index: number,
  ): JSX.Element => {
    const name = decision.name;
    const ifgotoName: string = getGotoName(
        decision.ifGoTo,
      selectSequence?.sequenceStepCTOs || [],
      selectSequence?.decisions || [],
    );
    const elsegotoName: string = getGotoName(
        decision.elseGoTo,
      selectSequence?.sequenceStepCTOs || [],
      selectSequence?.decisions || [],
    );
    const root: string = decision.root ? 'start' : '';
    const trClass = 'carv2Tr';
    return (
      <tr key={index} className={trClass}>
        <td>{name}</td>
        <td>{ifgotoName}</td>
        <td>{elsegotoName}</td>
        <td>
          <Carv2TableButton
            icon="wrench"
            onClick={() => dispatch(EditActions.setMode.editDecision(decision))}
          />
        </td>
        <td>{root}</td>
      </tr>
    );
  };

  const createLinkColumn = (link: ChainlinkCTO, index: number): JSX.Element => {
    const name: string = link.chainLink.name;
    const sequenceName: string = link.sequence.sequenceTO.name;
    const dataSetupName: string = link.dataSetup.dataSetup.name;
    const gotoName: string = getChainGotoName(
        link.chainLink.goto,
        selectedChainlinks,
        selectedChainDecisions,
    );
    const root: string = link.chainLink.root ? 'start' : '';
    const trClass = 'carv2Tr';
    return (
      <tr key={index} className={trClass}>
        <td>{name}</td>
        <td>{sequenceName}</td>
        <td>{dataSetupName}</td>
        <td>{gotoName}</td>
        <td>
          <Carv2TableButton
            icon="wrench"
            onClick={() =>
              dispatch(EditActions.setMode.editChainLink(link.chainLink))
            }
          />
        </td>
        <td>{root}</td>
      </tr>
    );
  };

  const createChainDecisionColumn = (
      decision: ChainDecisionTO,
      index: number,
  ): JSX.Element => {
    const name: string = decision.name;
    const ifgoto: string = getChainGotoName(
        decision.ifGoTo,
        selectedChainlinks,
        selectedChainDecisions,
    );
    const elsegoto: string = getChainGotoName(
        decision.elseGoTo,
        selectedChainlinks,
        selectedChainDecisions,
    );
    const trClass = 'carv2Tr';
    return (
      <tr key={index} className={trClass}>
        <td>{name}</td>
        <td>{ifgoto}</td>
        <td>{elsegoto}</td>
        <td>
          <Carv2TableButton
            icon="wrench"
            onClick={() =>
              dispatch(EditActions.setMode.editChainDecision(decision))
            }
          />
        </td>
      </tr>
    );
  };

  const createDataSetupColumn = (
      dataSetup: DataSetupTO,
      index: number,
  ): JSX.Element => {
    const name: string = dataSetup.name;
    const trClass = 'carv2Tr';
    return (
      <tr key={index} className={trClass}>
        <td>{name}</td>
        <td>
          <Carv2TableButton
            icon="wrench"
            onClick={() =>
              dispatch(EditActions.setMode.editDataSetup(dataSetup.id))
            }
          />
          <Carv2TableButton
            icon="hand pointer"
            onClick={() => {
              dispatch(SequenceModelActions.setCurrentDataSetup(dataSetup.id));
              dispatch(EditActions.setMode.view());
            }}
          />
        </td>
      </tr>
    );
  };

  const getChainModelsTableBody = () => {
    let list: JSX.Element[] = [];
    if (sequences) {
      list = chainModles.map((chain, index) =>
        createChainModelColumn(chain, index),
      );
    }
    const numberOfColumns = 1;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };

  const getDecisionTableBody = () => {
    let list: JSX.Element[] = [];
    if (selectSequence !== null) {
      list = selectSequence.decisions.map((cond, index) =>
        createDecisionColumn(cond, index),
      );
    }
    const numberOfColumns = 2;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };

  const getChainTableBody = () => {
    let list: JSX.Element[] = [];
    if (calcChain !== null) {
      list = calcChain.calcLinks.map((link, index) =>
        createCalcLinkColumn(link, index),
      );
    }
    const numberOfColumns = 3;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };
  const getChainLinkTableBody = () => {
    let list: JSX.Element[] = [];
    if (calcChain !== null) {
      list = selectedChainlinks.map((link, index) =>
        createLinkColumn(link, index),
      );
    }
    const numberOfColumns = 3;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };
  const getChainDecisionTableBody = () => {
    let list: JSX.Element[] = [];
    if (calcChain !== null) {
      list = selectedChainDecisions.map((decision, index) =>
        createChainDecisionColumn(decision, index),
      );
      // list = chainDecisions.map((decision, index) => createChainDecisionColumn(decision, index));
    }
    const numberOfColumns = 1;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };
  const getDataSetupTableBody = () => {
    let list: JSX.Element[] = [];
    list = dataSetups.map((dataSetup, index) =>
      createDataSetupColumn(dataSetup, index),
    );
    const numberOfColumns = 1;
    fillWithEmptyRows(list, createEmptyRow, numberOfColumns);
    return list;
  };

  const createEmptyRow = (
      key: string,
      numberOfElements: number,
      className?: string,
  ): JSX.Element => {
    return (
      <tr key={key} className={className}>
        {new Array(numberOfElements).map((value, index) => {
          return <td key={index} />;
        })}
      </tr>
    );
  };

  const handleChainTableClickEvent = (index: number) => {
    dispatch(SequenceModelActions.setCurrentLinkIndex(index));
  };

  return {
    title: selectSequence
      ? selectSequence.sequenceTO.name
      : 'Select data setup and sequence to calculate ...',
    getDecisionTableBody,
    getChainTableBody,
    getChainDecisionTableBody,
    getChainLinkTableBody,
    getChainModelsTableBody,
    getDataSetupTableBody,
    showChainModelTab: !isNullOrUndefined(selectedChain),
    showSequenceModelTabs: !isNullOrUndefined(selectSequence),
    showCalcChainTab: !isNullOrUndefined(calcChain),
    showCalcSequenceTab: calcSteps.length > 0,
    activeTab,
    setActiveTab,

    modelSequenceData: useGetSequenceModelsTableBody(sequences),
    modelSequenceStepData: useGetStepTableData(selectSequence),
    calcSequenceData: useGetCalcSequenceTableData(calcSteps, selectSequence),
  };
};

function getChainGotoName(
    goto: GoToChain,
    selectedChainlinks: ChainlinkCTO[],
    selectedChainDecisions: ChainDecisionTO[],
) {
  let gotoName: string = 'could not find goto';
  switch (goto.type) {
    case GoToTypesChain.ERROR:
    case GoToTypesChain.FIN:
      gotoName = goto.type;
      break;
    case GoToTypesChain.LINK:
      gotoName
        = selectedChainlinks.find(
            (link) => link.chainLink.id === (goto as IntermediateChain).id,
        )?.chainLink.name || gotoName;
      break;
    case GoToTypesChain.DEC:
      gotoName
        = selectedChainDecisions.find(
            (dec) => dec.id === (goto as IntermediateChain).id,
        )?.name || gotoName;
      break;
  }
  return gotoName;
}

function getGotoName(
    goto: GoTo,
    steps: SequenceStepCTO[],
    decisions: DecisionTO[],
) {
  let gotoName: string = 'could not find goto';
  switch (goto.type) {
    case GoToTypes.ERROR:
    case GoToTypes.FIN:
    case GoToTypes.IDLE:
      gotoName = goto.type;
      break;
    case GoToTypes.STEP:
      gotoName
        = steps.find(
            (step) => step.squenceStepTO.id === (goto as Intermediate).id,
        )?.squenceStepTO.name || gotoName;
      break;
    case GoToTypes.DEC:
      gotoName
        = decisions.find((dec) => dec.id === (goto as Intermediate).id)?.name
        || gotoName;
      break;
  }
  return gotoName;
}

function fillWithEmptyRows(
    list: JSX.Element[],
    createEmptyRow: (
    key: string,
    numberOfElements: number,
    className?: string | undefined
  ) => JSX.Element,
    numberOfColumns: number,
) {
  let key: number = list.length;
  while (list.length < 10) {
    list.push(createEmptyRow(key.toString(), numberOfColumns, 'carv2Tr'));
    key++;
  }
}
