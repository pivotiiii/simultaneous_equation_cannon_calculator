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

    return (
        <div>
            <input
                type="text"
                placeholder="Levels/Ranks of opponents monsters (comma separated)."
                autoComplete="off"
                aria-describedby="monster_levels_helper"
                value={props.monsterLevelsInput}
                aria-invalid={props.invalidInput}
                onInput={(e) => validateInput(e.currentTarget.value)}
                onKeyUp={(e) => (e.key === "Enter" ? props.onEnter() : "")}
            />
            <small id="monster_levels_helper">
                {props.invalidInput
                    ? props.monsterLevelsInput.length > 0
                        ? "Level/Rank cannot be smaller than 1."
                        : "Levels/Ranks of opponents monsters."
                    : "Levels/Ranks of opponents monsters."}
            </small>
        </div>
    );
}
