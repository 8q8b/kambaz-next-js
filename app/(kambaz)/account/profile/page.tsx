import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen" className="p-3" style={{ maxWidth: 500 }}>
      <h1>Profile</h1>

      <FormControl id="wd-profile-username" placeholder="username" className="mb-2" />
      <FormControl id="wd-profile-password" placeholder="password" type="password" className="mb-2" />
      <FormControl id="wd-profile-firstname" placeholder="first name" className="mb-2" />
      <FormControl id="wd-profile-lastname" placeholder="last name" className="mb-2" />
      <FormControl id="wd-profile-dob" type="date" className="mb-3" />

      <Link id="wd-signout-btn" href="/account/signin" className="btn btn-danger w-100">
        Sign out
      </Link>
    </div>
  );
}
