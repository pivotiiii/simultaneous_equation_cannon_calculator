import {useId} from "react";
import {useWindowDimensions} from "../../../common";

interface MonsterLevelInputComponentProps {
    monsterLevelsInput: string;
    setMonsterLevelsInput: (val: string) => void;
    invalidInput: boolean;
    setInvalidInput: (val: boolean) => void;
    onEnter: Function;
}

export function MonsterLevelInputComponent(props: MonsterLevelInputComponentProps) {
    const validateInput = (input: string) => {
        const cleanInput: string = input.replace(/(?!,)\D/g, "");
        props.setMonsterLevelsInput(cleanInput);
        const vals: number[] = Array.from(
            new Set(
                cleanInput
                    .split(",")
                    .filter(Boolean)
                    .map((val) => parseInt(val)),
            ),
        );
        if (vals.length === 0) {
            props.setInvalidInput(true);
            return;
        }
        for (const val of vals) {
            if (val < 1) {
                props.setInvalidInput(true);
                return;
            }
        }
        props.setInvalidInput(false);
    };

    const {width} = useWindowDimensions() as {width: number; height: number};
    const descriptionDefaultBig = "Levels/Ranks of opponents monsters (comma separated).";
    const descriptionDefaultSmall = "Levels/Ranks of opponents monsters.";
    const descriptionError = "Level/Rank cannot be smaller than 1.";
    const placeholder = width > 700 ? descriptionDefaultBig : descriptionDefaultSmall;
    const labelTextDefault = width > 700 ? descriptionDefaultSmall : descriptionDefaultBig;
    const labelText = props.invalidInput
        ? props.monsterLevelsInput.length > 0
            ? descriptionError
            : labelTextDefault
        : labelTextDefault;
    const descId = useId();

    return (
        <div>
            <input
                type="text"
                placeholder={placeholder}
                autoComplete="off"
                aria-describedby={descId}
                value={props.monsterLevelsInput}
                aria-invalid={props.invalidInput}
                onInput={(e) => validateInput(e.currentTarget.value)}
                onKeyUp={(e) => (e.key === "Enter" ? props.onEnter() : "")}
            />
            <small id={descId}>{labelText}</small>
        </div>
    );
}
