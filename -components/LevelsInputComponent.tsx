import "./LevelsInputComponent.css";

interface LevelsInputComponentProps {
    description: string;
    extraDeckCards: number;
    levels: number[];
    setLevels: React.Dispatch<React.SetStateAction<number[]>>;
}

export function LevelsInputComponent(props: LevelsInputComponentProps) {
    const handleLevelSelect = (level: number) => {
        if (props.levels.includes(level)) {
            const levelsNew = props.levels.concat([]);
            levelsNew.splice(props.levels.indexOf(level), 1);
            props.setLevels(levelsNew);
        } else {
            //if (props.extraDeckCards < 15) {
            props.setLevels([...props.levels, level]);
        }
        //show ED15 error
    };

    const handleReset = () => {
        props.setLevels([]);
    };

    const possibleLevels = Array.from({length: 12}, (_, i) => i + 1);
    const displayReset = props.levels.length > 0;
    return (
        <>
            <div className="xyz-input-container">
                <div className="buttons-container">
                    {possibleLevels.map((level) => {
                        return (
                            <button
                                key={"xyz_select_" + level}
                                className={"level-button" + (props.levels.includes(level) ? " selected" : "")}
                                onClick={() => handleLevelSelect(level)}
                            >
                                {level}
                            </button>
                        );
                    })}
                </div>
                <small>
                    <div className="level-button-description">{props.description}</div>
                    {displayReset && (
                        <a className="reset-text" onClick={handleReset}>
                            reset
                        </a>
                    )}
                </small>
            </div>
        </>
    );
}
