import {useState, useRef, useEffect, useCallback, lazy, Suspense} from "react";
import {ResultsTableComponent} from "./ResultsTableComponent";
import {MonsterLevelInputComponent} from "./MonsterLevelInputComponent";
import {TotalCardsInputComponent} from "./TotalCardsInputComponent";
import {LevelsInputComponent} from "./LevelsInputComponent";
import {ToggleComponent} from "./ToggleComponent";

const CardTextDialogComponent = lazy(() => import("./CardTextDialogComponent"));

function getCombination(level: number, totalCards: number): Combination | null {
    const req_xyz = totalCards - level;
    const req_fusion = level - req_xyz;
    if (req_xyz > 0 && req_xyz < 14 && req_fusion > 0 && req_fusion < 13) {
        return {xyz: req_xyz, fusion: req_fusion, target: level, total_cards: totalCards};
    }
    return null;
}

function getAllCombinations(totalCards: number, monsterLevels: number[]): Combination[][] {
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
    const [invalidTotalCardsInput, setInvalidTotalCardsInput] = useState(null as unknown as boolean);
    const [monsterLevels, setMonsterLevels] = useState<number[]>([]);
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
            if (invalidTotalCardsInput === false && monsterLevels.length > 0) {
                setTimeout(() => tableDivRef.current?.scrollIntoView({behavior: "smooth", block: "end"}), 50);
                setShowResults(true);
            } else {
                if (monsterLevels.length > 0) {
                    setInvalidTotalCardsInput(true);
                }
            }
        }
    }, [showResults, invalidTotalCardsInput, monsterLevels]);

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
    }

    const showTable = showResults && (validCombinations.length > 0 || potentialCombinations.length > 0);

    return (
        <>
            <article>
                <h4>Board State</h4>
                <TotalCardsInputComponent
                    setTotalCards={setTotalCards}
                    onEnter={onCalculateClicked}
                    invalidTotalCardsInput={invalidTotalCardsInput}
                    setInvalidTotalCardsInput={setInvalidTotalCardsInput}
                />
                <LevelsInputComponent
                    description="Levels/Ranks of opponents monsters." // (optional)"
                    extraDeckCards={-1}
                    levels={monsterLevels}
                    setLevels={setMonsterLevels}
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
            {showCardText && (
                <Suspense fallback={<dialog open aria-busy></dialog>}>
                    <CardTextDialogComponent setShowCardText={setShowCardText} />
                </Suspense>
            )}

            <div ref={tableDivRef} style={{minHeight: minTableHeight}}>
                {showResults && (
                    <article>
                        {showTable ? (
                            <>
                                {validCombinations.length > 0 ? (
                                    <>
                                        <h4>Possible combinations</h4>
                                        <ResultsTableComponent combinations={validCombinations} />
                                    </>
                                ) : (
                                    <h4>No possible combinations for this game state.</h4>
                                )}
                                {potentialCombinations.length > 0 ? (
                                    <>
                                        <h4>Almost possible combinations</h4>
                                        <ResultsTableComponent
                                            combinations={potentialCombinations}
                                            showRelative={showRelativeValues}
                                            totalCards={totalCards}
                                        />
                                    </>
                                ) : (
                                    <h4>No almost possible combinations for this game state.</h4>
                                )}
                            </>
                        ) : (
                            <h4>No possible or almost possible combinations for this game state.</h4>
                        )}
                    </article>
                )}
            </div>
        </>
    );
}
