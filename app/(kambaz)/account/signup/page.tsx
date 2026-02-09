import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Signup() {
  return (
    <div id="wd-signup-screen" className="p-3" style={{ maxWidth: 350 }}>
      <h1>Sign up</h1>

      <FormControl id="wd-signup-username" placeholder="username" className="mb-2" />
      <FormControl id="wd-signup-password" placeholder="password" type="password" className="mb-2" />
      <FormControl id="wd-signup-firstname" placeholder="first name" className="mb-2" />
      <FormControl id="wd-signup-lastname" placeholder="last name" className="mb-2" />
      <FormControl id="wd-signup-dob" type="date" className="mb-2" />

      <Link
        id="wd-signup-btn"
        href="/account/profile"
        className="btn btn-primary w-100 mb-2"
      >
        Sign up
      </Link>

      <Link id="wd-signin-link" href="/account/signin">
        Sign in
      </Link>
    </div>
  );
}
