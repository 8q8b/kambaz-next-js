import "./index.css";
import { Container } from "react-bootstrap";

import ForegroundColors from "./ForegroundColors";
import BackgroundColors from "./BackgroundColors";
import Borders from "./Borders";
import Padding from "./Padding";
import Margins from "./Margins";
import Corners from "./Corners";
import Dimensions from "./Dimensions";
import Positions from "./Positions";
import Zindex from "./Zindex";
import Float from "./Float";
import GridLayout from "./GridLayout";
import Flex from "./Flex";
import MediaQueriesDemo from "./MediaQueriesDemo";
import ReactIconSampler from "./ReactIconSampler";
import BootstrapNavigation from "./BootstrapNavigation";
import BootstrapGrids from "./BootstrapGrids";  
import ScreenSizeLabel from "./ScreenSizeLabel";
import BootstrapTables from "./BootstrapTables";
import BootstrapForms from "./BootstrapForms";
import BootstrapLists from "./BootstrapLists";

export default function Lab2() {
    return (
        <Container>
            <h2>Lab 2 - Cascading Style Sheets</h2>
            <h3>Styling with the STYLE attribute</h3>
            <p>
                Style attribute allows configuring look and feel right on the element.
                Although it's very convenient it is considered bad practice and you should avoid using the style attribute
            </p>
            <p id="wd-id-selector-1">
                Instead of changing the look and feel of all the
                elements of the same name, e.g., P, we can refer to a specific element by its ID
            </p>

            <p id="wd-id-selector-2">
                Here's another paragraph using a different ID and a different look and feel
            </p>
            <ForegroundColors />
            <BackgroundColors />
            <Borders />
            <Padding />
            <Margins />
            <Corners />
            <Dimensions />
            <Positions />
            <Zindex />
            <Float />
            <GridLayout />
            <Flex />
            <MediaQueriesDemo />
            <ReactIconSampler />
            <BootstrapNavigation />
            <BootstrapGrids />
            <ScreenSizeLabel />
            <BootstrapTables />
            <BootstrapLists />
            <BootstrapForms />

        </Container>
    );
}
