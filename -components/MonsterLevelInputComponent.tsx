import {useCallback, useEffect, useId, useState} from "react";
// import {useWindowDimensions} from "../../../common";
import {UpDownButtonsComponent} from "./UpDownButtonsComponent";
import "./MonsterLevelInputComponent.css";

interface MonsterLevelInputComponentProps {
    setMonsterLevels: React.Dispatch<React.SetStateAction<Set<number>>>;
    onEnter: Function;
}

// const {width} = useWindowDimensions() as {width: number; height: number};
const descriptionDefaultBig = "Levels/Ranks of opponents monsters (comma\u00A0separated).";
const descriptionDefaultSmall = "Levels/Ranks of opponents monsters.";
const descriptionError = "Level/Rank cannot be smaller than 1.";
const placeholder = descriptionDefaultSmall; //width > 700 ? descriptionDefaultBig : descriptionDefaultSmall;
const labelTextDefault = descriptionDefaultBig; //width > 700 ? descriptionDefaultSmall : descriptionDefaultBig;

export function MonsterLevelInputComponent(props: MonsterLevelInputComponentProps) {
    const [monsterLevelsInput, setMonsterLevelsInput] = useState("");
    const [invalidMonsterLevelsInput, setInvalidMonsterLevelsInput] = useState(null as unknown as boolean);
    const descId = useId();

    const showError = invalidMonsterLevelsInput && monsterLevelsInput.length > 0;

    const validateInput = useCallback((input: string) => {
        const cleanInput: string = input.replace(/(?!,)\D/g, "");
        setMonsterLevelsInput(cleanInput);
        const vals = new Set(
            cleanInput
                .split(",")
                .filter(Boolean)
                .map((val) => parseInt(val)),
        );
        if (vals.size === 0) {
            setInvalidMonsterLevelsInput(true);
            return;
        }
        for (const val of vals) {
            if (val < 1) {
                setInvalidMonsterLevelsInput(true);
                return;
            }
        }
        setInvalidMonsterLevelsInput(false);
        props.setMonsterLevels(vals);
    }, []);

    const validateInputButtons = useCallback(
        (input: string) => {
            if (monsterLevelsInput.split(",").filter(Boolean).length > 0) {
                const levelsArray = monsterLevelsInput.split(",").filter(Boolean);
                levelsArray[levelsArray.length - 1] = input;
                validateInput(levelsArray.join(","));
            } else {
                validateInput(input);
            }
        },
        [monsterLevelsInput],
    );

    return (
        <div>
            <div style={{display: "flex", alignItems: "start"}}>
                <input
                    type="text"
                    className="monster-level-input"
                    placeholder={placeholder}
                    autoComplete="off"
                    aria-describedby={descId}
                    value={monsterLevelsInput}
                    aria-invalid={invalidMonsterLevelsInput}
                    onInput={(e) => validateInput(e.currentTarget.value)}
                    onKeyUp={(e) => (e.key === "Enter" ? props.onEnter() : "")}
                />
                <UpDownButtonsComponent
                    change={1}
                    state={monsterLevelsInput.split(",").filter(Boolean).at(-1) || ""}
                    setState={validateInputButtons}
                />
            </div>
            {/*so small has correct style*/}
            <input style={{display: "none"}}></input>
            <small id={descId}>{showError ? descriptionError : labelTextDefault}</small>
        </div>
    );
}
