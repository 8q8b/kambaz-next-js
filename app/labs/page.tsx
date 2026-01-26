import Link from "next/link";

export default function Labs() {
    return (
        <div id="wd-labs">
            <h1>Labs</h1>
            <ul>
                <li>
                    <Link href="/labs/lab1" id="wd-lab1-link">
                        Lab 1: HTML Examples
                    </Link>
                </li>
                <li>
                    <a href="/kambaz" id="wd-kambaz-link">
                        Kambaz
                    </a>
                </li>

            </ul>
        </div>
    );
}
