import {useState, useRef, useEffect, useCallback} from "react";
import {CardTextDialogComponent} from "./CardTextDialogComponent";
import {ResultsTableComponent} from "./ResultsTableComponent";
import {MonsterLevelInputComponent} from "./MonsterLevelInputComponent";
import {TotalCardsInputComponent} from "./TotalCardsInputComponent";
import {LevelsInputComponent} from "./LevelsInputComponent";
import {ToggleComponent} from "./ToggleComponent";

function getCombination(level: number, totalCards: number): Combination | null {
    const req_xyz = totalCards - level;
    const req_fusion = level - req_xyz;
    if (req_xyz > 0 && req_xyz < 14 && req_fusion > 0 && req_fusion < 13) {
        return {xyz: req_xyz, fusion: req_fusion, target: level, total_cards: totalCards};
    }
    return null;
}

function getAllCombinations(totalCards: number, monsterLevels: Set<number>): Combination[][] {
    const validCombinations = new Array();
    const potentialCombinations = new Array();
    for (const level of monsterLevels) {
        const v_combination = getCombination(level, totalCards);
        if (v_combination != null) {
            validCombinations.push(v_combination);
        }
        for (let cards = 2; cards < 143; cards++) {
            const p_combination = getCombination(level, cards);
            if (p_combination != null && p_combination.total_cards !== totalCards) {
                potentialCombinations.push(p_combination);
            }
        }
    }
    return new Array(validCombinations, potentialCombinations);
}

const showRelativeValuesLsKey = "showRelVals";
const showRelativeValuesDefault = JSON.parse(localStorage.getItem(showRelativeValuesLsKey) || "false");

export function SECCComponent() {
    const tableDivRef = useRef<HTMLDivElement | null>(null);
    const [minTableHeight, setMinTableHeight] = useState(0);

    const [totalCards, setTotalCards] = useState(0);
    const [monsterLevels, setMonsterLevels] = useState<Set<number>>(new Set());
    const [xyzRanks, setXyzRanks] = useState<number[]>([]);
    const [fusionLevels, setFusionLevels] = useState<number[]>([]);

    const [showRelativeValues, setShowRelativeValues] = useState(showRelativeValuesDefault);
    const [showResults, setShowResults] = useState(false);
    const [showCardText, setShowCardText] = useState(false);

    useEffect(() => {
        if (showResults && tableDivRef.current) {
            setMinTableHeight(tableDivRef.current.offsetHeight);
        }
    });

    const onCalculateClicked = useCallback(() => {
        if (showResults === false) {
            setTimeout(() => tableDivRef.current?.scrollIntoView({behavior: "smooth", block: "end"}), 50);
        }
        setShowResults(true);
    }, [showResults]);

    const filterFunc = useCallback(
        (c: Combination) => {
            return (
                (xyzRanks.length === 0 || xyzRanks.includes(c.xyz)) &&
                (fusionLevels.length === 0 || fusionLevels.includes(c.fusion))
            );
        },
        [xyzRanks, fusionLevels],
    );

    let validCombinations = new Array<Combination>();
    let potentialCombinations = new Array<Combination>();

    if (showResults) {
        const results = getAllCombinations(totalCards, monsterLevels);
        validCombinations = results[0].filter((c) => filterFunc(c));
        potentialCombinations = results[1].filter((c) => filterFunc(c));
        // if ((tableDiv.current?.offsetHeight || 0) > minTableHeight.current) {
        //     minTableHeight.current = tableDiv.current?.offsetHeight || 0;
        // }
    }

    const showTable = showResults && (validCombinations.length > 0 || potentialCombinations.length > 0);

    return (
        <>
            <article>
                <h4>Board State</h4>
                <TotalCardsInputComponent setTotalCards={setTotalCards} onEnter={onCalculateClicked} />
                <MonsterLevelInputComponent
                    setMonsterLevels={setMonsterLevels}
                    onEnter={onCalculateClicked}
                />
                <h4>Extra Deck (optional)</h4>
                <LevelsInputComponent
                    description="XYZ monster ranks in your Extra Deck." // (optional)"
                    extraDeckCards={-1}
                    levels={xyzRanks}
                    setLevels={setXyzRanks}
                />
                <LevelsInputComponent
                    description="Fusion monster levels in your Extra Deck." // (optional)"
                    extraDeckCards={-1}
                    levels={fusionLevels}
                    setLevels={setFusionLevels}
                />
                <input type="button" value="Calculate" onClick={onCalculateClicked} />
                <div style={{display: "flex"}}>
                    <div>
                        <ToggleComponent
                            description="Show relative values"
                            state={showRelativeValues}
                            setState={setShowRelativeValues}
                            localStorageKey={showRelativeValuesLsKey}
                        />
                    </div>
                    <div style={{marginLeft: "auto", marginRight: 0}}>
                        <a href="#" onClick={() => setShowCardText(true)}>
                            View card text
                        </a>
                    </div>
                </div>
            </article>
            <CardTextDialogComponent showCardText={showCardText} setShowCardText={setShowCardText} />
            <div ref={tableDivRef} style={{minHeight: minTableHeight}}>
                <article style={{display: showResults ? "" : "none"}}>
                    <div style={{display: showTable ? "" : "none"}}>
                        <ResultsTableComponent
                            title="Possible combinations"
                            error="No possible combinations for this game state."
                            combinations={validCombinations}
                        />
                    </div>
                    <div style={{display: showTable ? "" : "none"}}>
                        <ResultsTableComponent
                            title="Almost possible combinations"
                            error="No almost possible combinations for this game state."
                            combinations={potentialCombinations}
                            showRelative={showRelativeValues}
                            totalCards={totalCards}
                        />
                    </div>
                    <h4
                        style={{
                            display:
                                validCombinations.length > 0 || potentialCombinations.length > 0
                                    ? "none"
                                    : "",
                        }}
                    >
                        No combinations for this game state.
                    </h4>
                </article>
            </div>
        </>
    );
}
