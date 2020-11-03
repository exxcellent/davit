import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import logo from '../../icons/logo200.png';
import {EditActions, editSelectors, Mode} from '../../slices/EditSlice';
import {Carv2ButtonGroup} from '../common/fragments/buttons/Carv2ButtonGroup';
import {Carv2SidePanelButton} from '../common/fragments/buttons/Carv2SidePanelButton';

export interface SidePanelProps { }

export const SidePanelController: FunctionComponent<SidePanelProps> = (props) => {
  const {setModeToEdit, setModeToFile, setModeToView, setModeToTab, mode} = useSidePanelViewModel();

  return (
    <div className="leftPanel">
      <Carv2ButtonGroup>
        <Carv2SidePanelButton icon="write" onClick={setModeToEdit} active={mode.includes(Mode.EDIT.toString())} />
        <Carv2SidePanelButton icon="eye" onClick={setModeToView} active={mode === Mode.VIEW} />
        <Carv2SidePanelButton icon="file" onClick={setModeToFile} active={mode === Mode.FILE} />
        <Carv2SidePanelButton icon="external alternate" onClick={setModeToTab} active={mode === Mode.TAB} />
      </Carv2ButtonGroup>

      {/* <Button.Group basic vertical size="big" inverted color="orange">
        <Button inverted color="orange" icon="write" onClick={setModeToEdit} />
        <Button inverted color="orange" icon="eye" onClick={setModeToView} />
        <Button inverted color="orange" icon="file" onClick={setModeToFile} />
        <Button inverted color="orange" icon="external alternate" onClick={setModeToTab} />
      </Button.Group> */}
      <div style={{position: 'absolute', bottom: '1em'}}>
        <img src={logo} alt="fireSpot" />
        <div
          className="verticalLabel"
        // style={{
        //   writingMode: "sideways-lr",
        //   textOrientation: "upright",
        //   fontSize: "3em",
        //   fontFamily: "Arial Rounded MT Bold",
        //   paddingLeft: "15px",
        //   marginTop: "0.5em",
        //   marginBottom: "1em",
        //   color: "#0060A9",
        // }}
        >
          DAVIT by
        </div>
      </div>
    </div>
  );
};

const useSidePanelViewModel = () => {
  const dispatch = useDispatch();
  const mode = useSelector(editSelectors.mode);

  const setModeToEdit = () => {
    dispatch(EditActions.setMode.edit());
  };

  const setModeToView = () => {
    dispatch(EditActions.setMode.view());
  };

  const setModeToFile = () => {
    dispatch(EditActions.setMode.file());
  };

  const setModeToTab = () => {
    dispatch(EditActions.setMode.tab());
  };

  return {
    setModeToEdit,
    setModeToView,
    setModeToFile,
    setModeToTab,
    mode,
  };
};
