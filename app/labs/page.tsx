import Link from "next/link";

export default function Labs() {
    return (

        <div id="wd-labs">
            <h3>Xavier Galanes</h3>

            <h1>Labs</h1>
            <ul>
                <li>
                    <Link href="/labs/lab1" id="wd-lab1-link">
                        Lab 1: HTML Examples
                    </Link>
                </li>
                <li>
                    <Link href="/labs/lab2" id="wd-lab2-link">
                        Lab 2: Cascading Style Sheet
                    </Link>
                </li>
                <li>
                    <Link href="/labs/lab3" id="wd-lab3-link">
                        Lab 3: React
                    </Link>
                </li>
                <li>
                    <a href="/" id="wd-kambaz-link">
                        Kambaz
                    </a>
                </li>

            </ul>
        </div>
    );
}
