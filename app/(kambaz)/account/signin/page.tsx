import Link from "next/link";

export default function Signin() {
    return (
        <div id="wd-signin-screen">
            <h3>Sign in</h3>
            <input
                name = "username"
                placeholder="username" 
                className="wd-username" 
                defaultValue = "alice"
                /> <br />
            <input
                placeholder="password"
                type="password"
                className="wd-password"
                defaultValue="password"
            />{" "}
            <br />
            <Link href="/dashboard" id="wd-signin-btn">
                {" "}
                Sign in{" "}
            </Link>{" "}
            <br />
            <Link href="signup" id="wd-signup-link">
                {" "}
                Sign up{" "}
            </Link>
        </div>
    );
}
