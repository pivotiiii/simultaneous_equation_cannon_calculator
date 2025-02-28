import {useCallback} from "react";
import "./ResultsTableComponent.css";

declare global {
    interface Combination {
        xyz: number;
        fusion: number;
        target: number;
        total_cards: number;
    }
}

interface ResultsTableBodyComponentProps {
    combinations: Combination[];
    showRelative?: boolean;
    totalCards?: number;
}

function ResultsTableBodyComponent({
    combinations,
    showRelative = false,
    totalCards = 0,
}: ResultsTableBodyComponentProps) {
    const showTotal = useCallback(
        (c: Combination) => {
            if (!showRelative) {
                return c.total_cards;
            }
            if (totalCards != 0 && c.total_cards - totalCards > 0) {
                return "+" + (c.total_cards - totalCards);
            }
            return c.total_cards - totalCards;
        },
        [showRelative, totalCards],
    );

    const sortRelatives = useCallback(
        (a: Combination, b: Combination): number => {
            if (a.total_cards === b.total_cards) {
                if (a.xyz > b.xyz) {
                    return 1;
                }
            }
            if (Math.abs(a.total_cards - totalCards) >= Math.abs(b.total_cards - totalCards)) {
                return 1;
            }
            return -1;
        },
        [totalCards],
    );

    return (
        <>
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
        </>
    );
}

interface ResultsTableSeparatorComponentProps {
    display: boolean;
    text?: string;
}

function ResultsTableSeparatorComponent(props: ResultsTableSeparatorComponentProps) {
    return (
        <thead style={{display: props.display ? "" : "none"}}>
            <tr>
                <td colSpan={4} style={{textAlign: "center"}}>
                    {props.text}
                </td>
            </tr>
        </thead>
    );
}

interface ResultsTableComponentProps {
    combinations: Combination[];
    title: string;
    error: string;
    /** only needed for potential combinations */
    totalCards?: number;
    /** only needed for potential combinations */
    showRelative?: boolean;
}

const columns: string[] = ["Total Cards", "XYZ Rank", "Fusion Level", "Target Level"];

export function ResultsTableComponent(props: ResultsTableComponentProps) {
    const noResults: boolean = props.combinations.length === 0;
    return (
        <>
            <div style={{textAlign: "left", display: noResults ? "" : "none"}}>
                <h4>{props.error}</h4>
            </div>
            <div style={{display: noResults ? "none" : ""}}>
                <h4>{props.title}</h4>
                <table className="striped rounded-corners">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column} scope="col" style={{textAlign: "center"}}>
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <ResultsTableBodyComponent
                        combinations={props.combinations}
                        totalCards={props.totalCards}
                        showRelative={props.showRelative}
                    />
                </table>
            </div>
        </>
    );
}
