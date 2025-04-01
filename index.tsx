import {createFileRoute} from "@tanstack/react-router";
import {SECCComponent} from "./-components/SECCComponent";
import og_image from "./-assets/og_image_secc.png?format=webp&imagetools";

const urlRoute = "/simultaneous_equation_cannon_calculator/";
const title = "Simultaneous Equation Cannons - Calculator";
const description =
    "Calculate all possible combinations of extra deck monsters to activate the Yu-Gi-Oh! trap card Simultaneous Equation Cannons for a given game state.";

export const Route = createFileRoute(urlRoute)({
    component: SECCContainerComponent,
    head: () => ({
        title: title,
        meta: [
            {title: title},
            {name: "description", content: description},
            {property: "og:title", content: title},
            {property: "og:image", content: og_image},
            {property: "og:type", content: "website"},
            {property: "og:url", content: __URL__ + urlRoute.slice(0, -1)},
            {property: "og:site_name", content: "pivotiiii"},
            {property: "og:description", content: description},
            {name: "twitter:card", content: "summary_large_image"},
            {name: "twitter:title", content: title},
            {name: "twitter:description", content: description},
            {name: "twitter:image", content: og_image},
        ],
        links: [{rel: "canonical", href: __URL__ + urlRoute.slice(0, -1)}],
    }),
});

function SECCContainerComponent() {
    return (
        <div className="pink">
            <div>
                <h1>Simultaneous Equation Cannons - Calculator</h1>
            </div>
            <SECCComponent />
        </div>
    );
}
