import { FaCalendar, FaEnvelopeOpenText, FaRegClock } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaBookBible } from "react-icons/fa6";
import { VscAccount } from "react-icons/vsc";

export default function ReactIconsSampler() {
  return (
    <div id="wd-react-icons-sampler" className="mb-4">
      <h3>React Icons Sampler</h3>

      <div className="d-flex align-items-center gap-3">
        <AiOutlineDashboard /> <span>Dashboard</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <VscAccount /> <span>Account</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <FaBookBible /> <span>Courses</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <FaCalendar /> <span>Calendar</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <FaEnvelopeOpenText /> <span>Inbox</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <FaRegClock /> <span>History</span>
      </div>
    </div>
  );
}
