import "./ProjectPage.css";
import { FaArrowAltCircleLeft, FaSearch } from 'react-icons/fa';

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from "react"

import { FaArrowRight, FaWrench } from "react-icons/fa";

import { CreateTask } from '../components/modal/CreateTask';
import { TaskCard } from '../components/TaskCard';
import { AuthContext } from "../context/AuthContext";
import { fetchTasksByProject } from "../api/todolist.api";

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

  return (
    <div>
      <div className="aside">
        <div className="main-buttons">
          <p className="create-btn" onClick={() => { navigate("/home"); setSection("Home"); }}> <FaArrowAltCircleLeft /> Projects</p>
          <hr />
          <CreateTask id_project={id} addNewTask={addNewTask} />
          <hr />
          <div className="filter">
            <p>All</p>
            <p>Completed</p>
            <p>In Progress</p>
            <p><FaSearch /> search</p>
          </div>
        </div>
      </div>
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