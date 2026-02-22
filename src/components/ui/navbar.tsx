import "./navbar.css";
import { LuMenu } from "react-icons/lu";
import Link from "next/link";

export default function Navbar({ active, logo }: { active: number; logo: string }) {
  return (
    <div className="navbar">
      <nav>
        <input type="checkbox" id="check" />
        <label htmlFor="check" className="checkbtn">
          <LuMenu size={40} style={{ color: "white" }} />
        </label>
        <span className="logo">{logo}</span>
        <ul>
          <li>
            <Link href="/" className={active === 1 ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/perks" className={active === 2 ? "active" : ""}>
              Cabinet
            </Link>
          </li>
          <li>
            <Link href="/perks" className={active === 2 ? "active" : ""}>
              Event
            </Link>
          </li>
          <li>
            <a href="https://dsc.gg/anomaly-network/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
