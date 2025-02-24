interface TotalCardsInputComponentProps {
    totalCardsInput: string;
    setTotalCardsInput: (val: string) => void;
    invalidInput: boolean;
    setInvalidInput: (val: boolean) => void;
    onEnter: Function;
}

const minCards = 1; //needs 1 target on field, trap could be rollbacked
const maxCards = 144; //each 60 cards in hand + 5 monsters + 5 spells + 1 link zone + 1 field spell

export function TotalCardsInputComponent(props: TotalCardsInputComponentProps) {
    const validateInput = (input: string) => {
        const cleanInput: string = input.replace(/\D/g, "");
        props.setTotalCardsInput(cleanInput);
        const val: number = parseInt(cleanInput);
        if (val < minCards || val > maxCards || cleanInput.length === 0) {
            props.setInvalidInput(true);
        } else {
            props.setInvalidInput(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Total cards on board and in hand."
                autoComplete="off"
                aria-describedby="total_cards_helper"
                value={props.totalCardsInput}
                aria-invalid={props.invalidInput}
                onInput={(e) => validateInput(e.currentTarget.value)}
                onKeyUp={(e) => (e.key === "Enter" ? props.onEnter() : "")}
            />
            <small id="total_cards_helper">
                {props.invalidInput
                    ? "Must be a number between " + minCards + " and " + maxCards + "."
                    : "Total cards on board and in hand."}
            </small>
        </div>
    );
}
