interface ToggleComponentProps {
    description: string;
    state: boolean;
    setState: React.Dispatch<React.SetStateAction<boolean>>;
    localStorageKey?: string;
}

export function ToggleComponent(props: ToggleComponentProps) {
    const handleChange = () => {
        props.setState(!props.state);
        if (props.localStorageKey) {
            localStorage.setItem(props.localStorageKey, JSON.stringify(!props.state));
        }
    };

    return (
        <label>
            <input type="checkbox" role="switch" checked={props.state} onChange={handleChange} />
            {props.description}
        </label>
    );
}
