import {useCallback} from "react";
import "./UpDownButtonsComponent.css";

interface UpDownButtonsComponentProps {
    change: number;
    setState: Function;
    state: number | string;
}

export function UpDownButtonsComponent(props: UpDownButtonsComponentProps) {
    const buttonPressed = useCallback(
        (change: number) => {
            let val: number | string;
            if (typeof props.state === "number") {
                val = props.state;
            } else {
                val = parseInt(props.state);
            }
            val = isNaN(val) ? 0 : val;
            if (val + change >= 0) {
                val = val + change;
            }
            if (typeof props.state === "number") {
                props.setState(val);
            } else {
                props.setState(val.toString());
            }
        },
        [props.state],
    );

    return (
        <div className="plus-minus-button-container">
            <button
                className="plus-button"
                tabIndex={-1}
                onClick={() => buttonPressed(props.change)}
            ></button>
            <button
                className="minus-button"
                tabIndex={-1}
                onClick={() => buttonPressed(-props.change)}
            ></button>
        </div>
    );
}
