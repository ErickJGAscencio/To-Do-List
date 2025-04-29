import { FaSpinner } from 'react-icons/fa';

function LoadingSpinner (){
  return (
    <div className="loading-container">
      <FaSpinner className="loader" style={{ color: "#0884c4" }} />
    </div>
  );
};
export default LoadingSpinner;