import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export function Navigation({ filter }) {
  const { username, isLoggedIn } = useContext(AuthContext);
  const [useFilter, setUseFilter] = useState([]);

  useEffect(() => {
    if (filter === 'all') {
      setUseFilter("All Projects");
    } else if (filter === 'completed') {
      setUseFilter("Completed Projects");
    } else if (filter === 'inprocess') {
      setUseFilter("In Progress Projects");
    }
  }, [filter]);
  
  return (
    <div className="nav">
      <div className="profile">
        <h3 className="user-name">
          Hi {isLoggedIn ? username : 'username'}!
        </h3>
      </div>
      <p className="seccion">{useFilter}</p>
    </div>
  )
}