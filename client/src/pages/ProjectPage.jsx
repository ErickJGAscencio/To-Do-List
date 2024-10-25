import "./ProjectPage.css";

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react"

import { CreateTask } from '../components/modal/CreateTask';
import { TaskCard } from '../components/TaskCard';
import { fetchTasksByProject } from "../api/todolist.api";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { Sidebar } from "../components/Sidebar";

export function ProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [projectsFiltered, setProjectsFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  const addNewTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const removeTask = (idToRemove) => {
    setTasks(tasks.filter((task) => task.id !== idToRemove));
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

  useEffect(() => {
    setTasks(tasks);
    setFilter("all");
  }, [tasks])

  const backToHome = () => {
    navigate('/home');
  }

  // Filtro proyectos con base al estado
  const setFilter = (filter) => {
    if (filter === "all") {
      setProjectsFiltered(tasks);

    } else if (filter === "completed") {
      const completedProjects = tasks.filter(task => task.is_completed === true);
      setProjectsFiltered(completedProjects);

    } else if (filter === "inProgress") {
      const inProgressProjects = tasks.filter(task => task.is_completed === false);
      setProjectsFiltered(inProgressProjects);
    }
  }

  // Filtro proyectos con base en el término de búsqueda
  const getFilteredProjects = () => {
    if (searchTerm.trim() === '') {
      return projectsFiltered;
    } else {
      return projectsFiltered.filter(
        task => task.task_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  return (
    <div>
      <div className="main-container">
        <Sidebar setFilter={setFilter}>
          {/* <p className="create-btn" onClick={backToHome}> <FaArrowLeft/> Projects</p> */}
          <CreateTask id_project={id} addNewTask={addNewTask} />
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Método para actualizar el término de búsqueda
            />
          </div>
        </Sidebar>
        <div className="main-filter-contain">
          <div className="main-tasks">
            {getFilteredProjects().map((task) => (
              <TaskCard key={task.id} task={task} removeTask={removeTask} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}