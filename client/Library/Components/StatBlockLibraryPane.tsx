import * as React from "react";
import { StatBlock } from "../../../common/StatBlock";
import { VariantMaximumHP } from "../../Combatant/GetOrRollMaximumHP";
import { linkComponentToObservables } from "../../Combatant/linkComponentToObservables";
import { LibrariesCommander } from "../../Commands/LibrariesCommander";
import { StatBlockComponent } from "../../Components/StatBlock";
import { CurrentSettings } from "../../Settings/Settings";
import { TextEnricher } from "../../TextEnricher/TextEnricher";
import { GetAlphaSortableLevelString } from "../../Utility/GetAlphaSortableLevelString";
import { Listing } from "../Listing";
import { StatBlockLibrary } from "../StatBlockLibrary";
import { ListingGroupFn } from "./BuildListingTree";
import { LibraryPane } from "./LibraryPane";
import { ButtonInfo, ListingRow, MakeEditButton } from "./ListingRow";

export type StatBlockLibraryPaneProps = {
  librariesCommander: LibrariesCommander;
  library: StatBlockLibrary;
  statBlockTextEnricher: TextEnricher;
};

type StatBlockListing = Listing<StatBlock>;

interface State {
  filter: string;
  groupingFunctionIndex: number;
  previewedStatBlock: StatBlock;
  previewIconHovered: boolean;
  previewWindowHovered: boolean;
  previewPosition: { left: number; top: number };
}

export class StatBlockLibraryPane extends React.Component<
  StatBlockLibraryPaneProps,
  State
> {
  constructor(props: StatBlockLibraryPaneProps) {
    super(props);
    this.state = {
      filter: "",
      groupingFunctionIndex: 0,
      previewedStatBlock: StatBlock.Default(),
      previewIconHovered: false,
      previewWindowHovered: false,
      previewPosition: { left: 0, top: 0 }
    };

    linkComponentToObservables(this);
  }

  public render() {
    const listings = this.props.library.GetStatBlocks();

    return (
      <LibraryPane
        defaultItem={StatBlock.Default()}
        listings={listings}
        renderListingRow={this.renderListingRow}
        groupByFunctions={this.groupingFunctions}
        addNewItem={() =>
          this.props.librariesCommander.CreateAndEditStatBlock(
            this.props.library
          )
        }
        renderPreview={statBlock => (
          <StatBlockComponent
            statBlock={statBlock}
            enricher={this.props.statBlockTextEnricher}
            displayMode="default"
          />
        )}
      />
    );
  }

  private groupingFunctions: ListingGroupFn[] = [
    l => ({
      key: l.Listing().Path
    }),
    l => ({
      label: "Challenge " + l.Listing().Metadata.Level,
      key: GetAlphaSortableLevelString(l.Listing().Metadata.Level)
    }),
    l => ({
      key: l.Listing().Metadata.Source
    }),
    l => ({
      key: l.Listing().Metadata.Type
    })
  ];

  private renderListingRow = (
    l: Listing<StatBlock>,
    onPreview,
    onPreviewOut
  ) => (
    <ListingRow
      key={l.Listing().Id + l.Listing().Path + l.Listing().Name}
      name={l.Listing().Name}
      showCount
      onAdd={this.loadSavedStatBlock(VariantMaximumHP.DEFAULT)}
      onPreview={onPreview}
      onPreviewOut={onPreviewOut}
      listing={l}
      buttons={[
        ...(CurrentSettings().Rules.EnableBossAndMinionHP &&
          this.bossAndMinionButtons),
        MakeEditButton(this.editStatBlock)
      ]}
    />
  );

  private loadSavedStatBlock = (variantMaximumHP: VariantMaximumHP) => (
    listing: StatBlockListing,
    hideOnAdd: boolean
  ) => {
    return this.props.librariesCommander.AddStatBlockFromListing(
      listing,
      hideOnAdd,
      variantMaximumHP
    );
  };

  private editStatBlock = (l: Listing<StatBlock>) => {
    l.Listing.subscribe(_ => this.forceUpdate());
    this.props.librariesCommander.EditStatBlock(l, this.props.library);
  };

  private bossAndMinionButtons: ButtonInfo<StatBlock>[] = [
    {
      faClass: "chess-pawn",
      buttonClass: "minion",
      title: "Add with 1 HP",
      onClick: this.loadSavedStatBlock(VariantMaximumHP.MINION)
    },
    {
      faClass: "crown",
      buttonClass: "boss",
      title: "Add with maximum HP",
      onClick: this.loadSavedStatBlock(VariantMaximumHP.BOSS)
    }
  ];
}
