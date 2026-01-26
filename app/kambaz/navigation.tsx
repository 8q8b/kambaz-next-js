import Link from "next/link";

export default function KambazNavigation() {
  return (
    <ul id="wd-kambaz-navigation">
      <li><Link href="/kambaz/account">Account</Link></li>
      <li><Link href="/kambaz/dashboard">Dashboard</Link></li>
      <li><Link href="/kambaz/courses">Courses</Link></li>
      <li><Link href="/kambaz/calendar">Calendar</Link></li>
      <li><Link href="/kambaz/inbox">Inbox</Link></li>
      <li><Link href="/kambaz/history">History</Link></li>
      <li><Link href="/kambaz/studio">Studio</Link></li>
      <li><Link href="/kambaz/commons">Commons</Link></li>
      <li><Link href="/kambaz/help">Help</Link></li>
    </ul>
  );
}
