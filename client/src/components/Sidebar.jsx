import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import CreateProject from './modal/CreateProject';

export function Sidebar({ setFilter }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleFilter = (filterType) => {
    setFilter(filterType);
    handleAllProjects();
  };

  const handleAllProjects = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="aside">
      <div className="main-buttons">
        <CreateProject />
        <button onClick={() => handleFilter('all')}>All Projects</button>
        <button onClick={() => handleFilter('inprocess')}>In Process Projects</button>
        <button onClick={() => handleFilter('completed')}>Completed Projects</button>
      </div>
      <div className="aux-buttons">
        <button onClick={handleLogout}>L</button>
        <button>Settings</button>
      </div>
    </div>
  )

}