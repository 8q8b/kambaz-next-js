import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2>
      <hr />

      <div id="wd-dashboard-courses">
        {/* Course 1 */}
        <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.jpg" width={200} height={150} alt="reactjs" />
            <div>
              <h5>CS1234 React JS</h5>
              <p className="wd-dashboard-course-title">Full Stack software developer</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        {/* Course 2 */}
        <div className="wd-dashboard-course">
          <Link href="/courses/2345" className="wd-dashboard-course-link">
            <Image src="/images/nodejs.jpg" width={200} height={150} alt="nodejs" />
            <div>
              <h5>CS2345 Node JS</h5>
              <p className="wd-dashboard-course-title">Backend development</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        {/* Course 3 */}
        <div className="wd-dashboard-course">
          <Link href="/courses/3456" className="wd-dashboard-course-link">
            <Image src="/images/mongodb.jpg" width={200} height={150} alt="mongodb" />
            <div>
              <h5>CS3456 MongoDB</h5>
              <p className="wd-dashboard-course-title">NoSQL databases</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        {/* Course 4 */}
        <div className="wd-dashboard-course">
          <Link href="/courses/4567" className="wd-dashboard-course-link">
            <Image src="/images/typescript.jpg" width={200} height={150} alt="typescript" />
            <div>
              <h5>CS4567 TypeScript</h5>
              <p className="wd-dashboard-course-title">Typed JavaScript</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        {/* Course 5 */}
        <div className="wd-dashboard-course">
          <Link href="/courses/5678" className="wd-dashboard-course-link">
            <Image src="/images/security.jpg" width={200} height={150} alt="security" />
            <div>
              <h5>CS5678 Web Security</h5>
              <p className="wd-dashboard-course-title">Secure web apps</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        {/* Course 6 */}
        <div className="wd-dashboard-course">
          <Link href="/courses/6789" className="wd-dashboard-course-link">
            <Image src="/images/uiux.jpg" width={200} height={150} alt="uiux" />
            <div>
              <h5>CS6789 UI/UX</h5>
              <p className="wd-dashboard-course-title">Design better interfaces</p>
              <button>Go</button>
            </div>
          </Link>
        </div>

        {/* Course 7 */}
        <div className="wd-dashboard-course">
          <Link href="/courses/7890" className="wd-dashboard-course-link">
            <Image src="/images/devops.jpg" width={200} height={150} alt="devops" />
            <div>
              <h5>CS7890 DevOps</h5>
              <p className="wd-dashboard-course-title">Deploy and scale</p>
              <button>Go</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
