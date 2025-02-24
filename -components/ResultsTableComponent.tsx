interface Combination {
    xyz: number;
    fusion: number;
    target: number;
    total_cards: number;
}

interface ResultsTableBodyComponentProps {
    combinations: Combination[];
    combinationType: "valid" | "potential";
    showRelative?: boolean;
    totalCards?: number;
}

function ResultsTableBodyComponent({
    combinations,
    combinationType,
    showRelative = false,
    totalCards = 0,
}: ResultsTableBodyComponentProps) {
    const showTotal = (c: Combination) => {
        if (!showRelative) {
            return c.total_cards;
        }
        if (totalCards != 0 && c.total_cards - totalCards > 0) {
            return "+" + (c.total_cards - totalCards);
        }
        return c.total_cards - totalCards;
    };

    const sortRelatives = (a: Combination, b: Combination): number => {
        if (a.total_cards === b.total_cards) {
            if (a.xyz > b.xyz) {
                return 1;
            }
            //return 0;
        }
        if (Math.abs(a.total_cards - totalCards) >= Math.abs(b.total_cards - totalCards)) {
            return 1;
        }
        return -1;
    };

    return (
        <tbody style={{display: combinations.length > 0 ? "" : "none"}}>
            {combinations.sort(sortRelatives).map((comb) => (
                <tr key={[comb.total_cards, comb.xyz, comb.fusion, comb.target].join("")}>
                    <td style={{textAlign: "center"}}>{showTotal(comb)}</td>
                    <td style={{textAlign: "center"}}>{comb.xyz}</td>
                    <td style={{textAlign: "center"}}>{comb.fusion}</td>
                    <td style={{textAlign: "center"}}>{comb.target}</td>
                </tr>
            ))}
        </tbody>
    );
}

function ResultsTableSeparatorComponent(props: {display: boolean}) {
    return (
        <thead style={{display: props.display ? "" : "none"}}>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </thead>
    );
}

interface ResultsTableComponentProps {
    validCombinations: Combination[];
    potentialCombinations: Combination[];
    totalCards: number;
    showRelative: boolean;
    showResults: boolean;
}

export function ResultsTableComponent(props: ResultsTableComponentProps) {
    const columns: string[] = ["Total Cards", "XYZ Rank", "Fusion Level", "Target Level"];
    // prettier-ignore
    const noResults: boolean = props.validCombinations.length === 0 && props.potentialCombinations.length === 0;
    return (
        <article style={{display: props.showResults ? "" : "none"}}>
            <div style={{textAlign: "center", display: noResults ? "" : "none"}}>
                <h4>No possible combinations for this game state.</h4>
            </div>
            <table className="striped" style={{display: noResults ? "none" : ""}}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col} scope="col" style={{textAlign: "center"}}>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <ResultsTableBodyComponent
                    combinations={props.validCombinations}
                    combinationType="valid"
                />
                <ResultsTableSeparatorComponent
                    display={
                        props.validCombinations.length > 0 && props.potentialCombinations.length > 0
                    }
                />
                <ResultsTableBodyComponent
                    combinations={props.potentialCombinations}
                    combinationType="potential"
                    totalCards={props.totalCards}
                    showRelative={props.showRelative}
                />
            </table>
        </article>
    );
}
