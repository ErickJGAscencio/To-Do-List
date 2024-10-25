import { FaSpinner } from 'react-icons/fa';
import "../pages/LogInPage.css";

export const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <FaSpinner className="loader" style={{ color: "#0884c4" }} />
    </div>
  );
};
