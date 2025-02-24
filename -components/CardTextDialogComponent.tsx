import cardImage from "../-assets/LEDE-EN080-664a92f0af.webp";

interface CardTextDialogComponentProps {
    showCardText: boolean;
    setShowCardText: (val: boolean) => void;
}

export function CardTextDialogComponent(props: CardTextDialogComponentProps) {
    return (
        <dialog open={props.showCardText ? true : false}>
            <article>
                {/* <h2>Simultaneous Equation Cannons</h2> */}
                <img
                    src={cardImage}
                    alt="card image"
                    style={{
                        borderRadius: "2%",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: 15,
                        marginBottom: 5,
                        width: "45%",
                    }}
                />
                <p style={{marginTop: "3%"}}>
                    Banish 1 Fusion Monster and 2 Xyz Monsters with the same Rank from your Extra
                    Deck, whose combined Level and Ranks equal the total number of cards in both
                    players' hands and on the field, then you can apply this effect.
                    <br />● Return 2 of your banished monsters to the Extra Deck (1 Xyz and 1
                    Fusion) whose combined Level and Rank equal the Level or Rank of 1 face-up
                    monster your opponent controls, then banish all cards they control.
                </p>
                <footer>
                    <a
                        role="button"
                        className="secondary"
                        href="https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=2&cid=19921&request_locale=en"
                    >
                        View on Yu-Gi-Oh! Card Database
                    </a>
                    <a role="button" onClick={() => props.setShowCardText(false)}>
                        Close
                    </a>
                </footer>
            </article>
        </dialog>
    );
}
