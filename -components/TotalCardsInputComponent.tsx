import {useId, useState, useRef, useCallback} from "react";
import {UpDownButtonsComponent} from "./UpDownButtonsComponent";

interface TotalCardsInputComponentProps {
    setTotalCards: React.Dispatch<React.SetStateAction<number>>;
    onEnter: Function;
    invalidTotalCardsInput: boolean;
    setInvalidTotalCardsInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const minCards = 1; //needs 1 target on field, trap could be rollbacked
const maxCards = 142; //each 60 cards in hand + 5 monsters + 5 spells + 1 link zone (no field spell, would reduce hand)
const descriptionDefault = "Total cards on board and in hand.";
const descriptionError = "Must be a number between " + minCards + " and " + maxCards + ".";

export function TotalCardsInputComponent(props: TotalCardsInputComponentProps) {
    const [totalCardsInput, setTotalCardsInput] = useState("");
    const descId = useId();

    const validateInput = useCallback((input: string) => {
        const cleanInput: string = input.replace(/\D/g, "");
        setTotalCardsInput(cleanInput);
        const val: number = parseInt(cleanInput);
        if (val < minCards || val > maxCards || cleanInput.length === 0) {
            props.setInvalidTotalCardsInput(true);
        } else {
            props.setInvalidTotalCardsInput(false);
            props.setTotalCards(val);
        }
    }, []);

    return (
        <div>
            <div style={{display: "flex", alignItems: "start"}}>
                <input
                    type="text"
                    placeholder={descriptionDefault}
                    autoComplete="off"
                    aria-describedby={descId}
                    value={totalCardsInput}
                    aria-invalid={props.invalidTotalCardsInput}
                    onInput={(e) => validateInput(e.currentTarget.value)}
                    onKeyUp={(e) => (e.key === "Enter" ? props.onEnter() : "")}
                />
                <UpDownButtonsComponent change={1} state={totalCardsInput} setState={validateInput} />
            </div>
            {/*so small has correct style*/}
            <input style={{display: "none"}}></input>
            <small id={descId}>{props.invalidTotalCardsInput ? descriptionError : descriptionDefault}</small>
        </div>
    );
}
