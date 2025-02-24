import * as React from "react";
import {createFileRoute} from "@tanstack/react-router";
import {CardTextDialogComponent} from "./-components/CardTextDialogComponent";
import {ResultsTableComponent} from "./-components/ResultsTableComponent";
import {MonsterLevelInputComponent} from "./-components/MonsterLevelInputComponent";
import {TotalCardsInputComponent} from "./-components/TotalCardsInputComponent";

const metaVars = [
    {title: "Simultaneous Equation Cannons - Calculator"},
    // prettier-ignore
    {name: "description", content: "Calculate all possible combinations of extra deck monsters to activate the Yu-Gi-Oh! trap card Simultaneous Equation Cannons for a given game state.",},
    // prettier-ignore
    {name: "keywords", content: "pivotiiii, yugioh, Yu-Gi-Oh!, Simultaneous Equation Cannons, calculator, extra deck, monsters, combinations",},
];

export const Route = createFileRoute("/simultaneous_equation_cannon_calculator/")({
    component: SECComponent,
    head: () => ({
        meta: metaVars,
    }),
});

interface Combination {
    xyz: number;
    fusion: number;
    target: number;
    total_cards: number;
}

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

function SECComponent() {
    const [totalCards, setTotalCards] = React.useState(0);
    const [totalCardsInput, setTotalCardsInput] = React.useState("");
    // prettier-ignore
    const [invalidTotalCardsInput, setInvalidTotalCardsInput] = React.useState(null as unknown as boolean);
    const [monsterLevelsInput, setMonsterLevelsInput] = React.useState("");
    const [monsterLevels, setMonsterLevels] = React.useState([0]);
    // prettier-ignore
    const [invalidMonsterLevelsInput, setInvalidMonsterLevelsInput] = React.useState(null as unknown as boolean);
    const [showResults, setShowResults] = React.useState(false);
    const [showRelativeValues, setShowRelativeValues] = React.useState(true);
    const [showCardText, setShowCardText] = React.useState(false);
    const [validCombinations, setValidCombinations] = React.useState(new Array());
    const [potentialCombinations, setPotentialCombinations] = React.useState(new Array());

    const onCalculateClicked = () => {
        // prettier-ignore
        if (invalidTotalCardsInput || invalidMonsterLevelsInput || invalidTotalCardsInput === null ||  invalidMonsterLevelsInput  ===  null) {
            return;
        }

        const totalCardsValue = parseInt(totalCardsInput);
        const monsterLevelsValues = Array.from(
            new Set(
                monsterLevelsInput
                    .split(",")
                    .filter(Boolean)
                    .map((val) => parseInt(val)),
            ),
        );

        setTotalCards(totalCardsValue);
        setMonsterLevels(monsterLevels);

        const results = getAllCombinations(totalCardsValue, monsterLevelsValues);
        setValidCombinations(results[0]);
        setPotentialCombinations(results[1]);
        setShowResults(true);
    };

    return (
        <div className="pink">
            <div>
                <h1>Simultaneous Equation Cannons - Calculator</h1>
            </div>

            <article>
                <TotalCardsInputComponent
                    totalCardsInput={totalCardsInput}
                    setTotalCardsInput={setTotalCardsInput}
                    invalidInput={invalidTotalCardsInput}
                    setInvalidInput={setInvalidTotalCardsInput}
                    onEnter={onCalculateClicked}
                />
                <MonsterLevelInputComponent
                    monsterLevelsInput={monsterLevelsInput}
                    setMonsterLevelsInput={setMonsterLevelsInput}
                    invalidInput={invalidMonsterLevelsInput}
                    setInvalidInput={setInvalidMonsterLevelsInput}
                    onEnter={onCalculateClicked}
                />
                <input type="button" value="Calculate" onClick={onCalculateClicked} />
                <div style={{display: "flex"}}>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                role="switch"
                                checked={showRelativeValues}
                                onChange={() => setShowRelativeValues(!showRelativeValues)}
                            />
                            Show relative values
                        </label>
                    </div>
                    <div style={{marginLeft: "auto", marginRight: 0}}>
                        <a href="#" onClick={() => setShowCardText(true)}>
                            View card text
                        </a>
                    </div>
                </div>
            </article>
            <CardTextDialogComponent
                showCardText={showCardText}
                setShowCardText={setShowCardText}
            />
            <ResultsTableComponent
                validCombinations={validCombinations}
                potentialCombinations={potentialCombinations}
                showResults={showResults}
                showRelative={showRelativeValues}
                totalCards={totalCards}
            />
        </div>
    );
}
