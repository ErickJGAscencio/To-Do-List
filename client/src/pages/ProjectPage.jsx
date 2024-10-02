import "./ProjectPage.css";
import { FaArrowAltCircleLeft } from 'react-icons/fa';

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from "react"
import { fetchTask} from "../Api/todolist.api";

import { CreateTask } from '../components/modal/CreateTask';
import { TaskCard } from '../components/TaskCard';
import { AuthContext } from "../context/AuthContext";

export function ProjectPage() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
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
          const res = await fetchTask(id, token);
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
        <button onClick={() => navigate("/home")}> <FaArrowAltCircleLeft /> Projects</button>
        <CreateTask id_project={id} addNewTask={addNewTask}/>
        <button >All Task</button>
        <button >In Process Tasks</button>
        <button >Completed Tasks</button>
        <div className="aux-buttons">
          <button onClick={handleLogout}>L</button>
          <button>S</button>
        </div>
      </div>
      <div className="main_content">        
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} removeTask={ removeTask } />
        ))}
      </div>
    </div>
  )
}