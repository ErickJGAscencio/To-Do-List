import "./ProjectPage.css";

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from "react"

import { CreateTask } from '../components/modal/CreateTask';
import { TaskCard } from '../components/TaskCard';
import { AuthContext } from "../context/AuthContext";
import { fetchTasksByProject } from "../api/todolist.api";
import { FaClipboardCheck, FaHourglassHalf, FaThList } from "react-icons/fa";
import { Sidebar } from "../components/Sidebar";

export function ProjectPage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { setSection } = useContext(AuthContext);
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);


  const addNewTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const removeTask = (idToRemove) => {
    setTasks(tasks.filter((task) => task.id !== idToRemove));
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    async function getAllPjcts() {
      const token = localStorage.getItem('token');
      if (token && id) {
        try {
          const res = await fetchTasksByProject(id, token);
          setTasks(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    }
    getAllPjcts();
  }, [id]);

  const sidebarButtons = [
    { label: 'All', onClick: () => setFilter('all'), icon: FaThList },
    { label: 'Completed', onClick: () => setFilter('completed'), icon: FaClipboardCheck },
    { label: 'In Progress', onClick: () => setFilter('inProgress'), icon: FaHourglassHalf }
  ];

  return (
    <div>
      <Sidebar buttons={sidebarButtons}>
        <CreateTask id_project={id} addNewTask={addNewTask} />
        {/* <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Método para actualizar el término de búsqueda
          />
        </div> */}
      </Sidebar>
      <div className="main-filter-contain">
        <div className="main_content">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} removeTask={removeTask} />
          ))}
        </div>
      </div>
    </div>
  )
}