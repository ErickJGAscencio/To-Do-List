import "./ProjectPage.css";
import { FaArrowAltCircleLeft } from 'react-icons/fa';

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
          <p className="create-btn" onClick={() => { navigate("/home"); setSection("Home");}}> <FaArrowAltCircleLeft /> Projects</p>
          <CreateTask id_project={id} addNewTask={addNewTask} />
          <p className="create-btn">All Task</p>
          <p className="create-btn">In Process Tasks</p>
          <p className="create-btn">Completed Tasks</p>
        </div>
        <div className="aux-buttons">
          <p onClick={handleLogout}><FaArrowRight /></p>
          <p><FaWrench /></p>
        </div>
      </div>
      <div className="main_content">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} removeTask={removeTask} />
        ))}
      </div>
    </div>
  )
}