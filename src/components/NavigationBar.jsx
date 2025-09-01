import './NavigationBar.css';
import { Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <nav className="nav-bar">
      <div className="nav-brand">
        <Link to="/">Parcel Tracking Manager</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="home-link">Home</Link>
      </div>
    </nav>
  );
}

export default NavigationBar;
