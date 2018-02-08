
import * as React from "react";
import { EncounterCommander } from "../../Commands/EncounterCommander";
import { Button } from "../../Components/Button";
import { Tabs } from "../../Components/Tabs";
import { TrackerViewModel } from "../../TrackerViewModel";
import { EncounterLibrary } from "../EncounterLibrary";
import { NPCLibrary } from "../NPCLibrary";
import { PCLibrary } from "../PCLibrary";
import { EncounterLibraryViewModel } from "./EncounterLibraryViewModel";
import { StatBlockLibraryViewModel } from "./StatBlockLibraryViewModel";


export interface LibrariesProps {
    encounterCommander: EncounterCommander;
    tracker: TrackerViewModel;
    encounterLibrary: EncounterLibrary;
    pcLibrary: PCLibrary;
    npcLibrary: NPCLibrary;
}

interface LibrariesState {
    selectedLibrary: string;
}
 
export class Libraries extends React.Component<LibrariesProps, LibrariesState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedLibrary: "Creatures"
        };
    }

    private hideLibraries = () => this.props.encounterCommander.HideLibraries();
    private selectLibrary = (library: string) => this.setState({ selectedLibrary: library });
    
    public render() {
        const libraries = {
            Creatures: <StatBlockLibraryViewModel encounterCommander={this.props.encounterCommander} library={this.props.npcLibrary} />,
            Players: <div>Players</div>,
            Encounters: <EncounterLibraryViewModel tracker={this.props.tracker} library={this.props.encounterLibrary} />,
            Spells: <div>Spells</div>,
        };


        return <React.Fragment>
            <h2>Library</h2>
            <Button faClass="close" onClick={this.hideLibraries} />
            <Tabs options={Object.keys(libraries)} onChoose={this.selectLibrary} selected={this.state.selectedLibrary} />
            {libraries[this.state.selectedLibrary]}
        </React.Fragment>;
    }
}