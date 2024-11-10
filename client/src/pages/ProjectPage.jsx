import "./ProjectPage.css";

import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react"

import { CreateTask } from '../components/modal/CreateTask';
import { TaskCard } from '../components/TaskCard';
import { fetchTasksByProject } from "../api/todolist.api";
import { FaArrowLeft, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { Sidebar } from "../components/Sidebar";
import TitleLabel from "../components/atoms/TitleLabel";
import SubTitleLabel from "../components/atoms/SubTitleLabel";

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
    <div className="content">
      <div className="main-content-items">
        <div className="menu">
          <div>
            <button>back</button>
            <TitleLabel label={"Website Redesing"} />
            <span>in progress</span>
          </div>
          <div>
            <button><FaEdit />Edit project</button>
          </div>
        </div>

        <div className="cards-sections">
          <div className="card-section">
            <p>Project Description</p>
            <SubTitleLabel label={'Deasjico j ajsd sjdias isa dskdjasdjo asjd sajdsadjas diasjdi saji si jisa djsia djias jsiadjsiadjisadsa sidsahdsdhas dhsa d.a sdjasi djas as as,d asd asd, as-dasdas dasio.'} />
          </div>

          <div className="card-section">
            <p>Overall Progress</p>
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-bar-fill"
                  style={{
                    // width: `${progress}%`,
                    width: '50%'
                  }}></div>
              </div>
            </div>
            <SubTitleLabel label={'50% completed'} />
          </div>

          <div className="card-section">
            <div className="menu">
              <div>
                <TitleLabel label={"Task"} />
              </div>
              <div>
                <button><FaPlus />New Task</button>
              </div>
            </div>
            <div className="main-tasks">
              {getFilteredProjects().map((task) => (
                <TaskCard key={task.id} task={task} removeTask={removeTask} />
              ))}
            </div>
          </div>

          <div className="card-section">
            <p>Commnets</p>
          </div>
        </div>
      </div>
      <div className="side-bar-project">
        <div className="cards-sections">
          <div className="card-section">
            <TitleLabel label={'Documents & Files'} />
            <SubTitleLabel label={'Deasjico j ajsd sjdias isa dskdjasdjo asjd sajdsadjas diasjdi saji si jisa djsia djias jsiadjsiadjisadsa sidsahdsdhas dhsa d.a sdjasi djas as as,d asd asd, as-dasdas dasio.'} />
          </div>

          <div className="card-section">
            <TitleLabel label={'Team Members'} />
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-bar-fill"
                  style={{
                    // width: `${progress}%`,
                    width: '50%'
                  }}></div>
              </div>
            </div>
            <SubTitleLabel label={'50% completed'} />
          </div>

          <div className="card-section">
            <TitleLabel label={'Project Statics'} />
          </div>
        </div>
        <div className="control-buttons">
          <div>
            <button><FaPlus />New Task</button>
          </div>
          <div>
            <button><FaPlus />Generate Report</button>
          </div>
          <div>
            <button><FaPlus />Archive Project</button>
          </div>
        </div>
      </div>
    </div>
  )
}