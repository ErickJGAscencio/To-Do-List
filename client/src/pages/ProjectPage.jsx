import "./ProjectPage.css";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react"
// API
import { deleteProject, fetchTasksByProject, updateProject } from "../api/todolist.api";
// Icons
import { FaArrowLeft, FaDownload, FaFile, FaPlus } from "react-icons/fa";
// Modal
import { CreateTask } from '../components/modal/CreateTask';
import Delete from "../components/modal/Delete";
import EditProject from "../components/modal/EditProject";
// Atoms
import TitleLabel from "../components/atoms/TitleLabel";
import Button from "../components/atoms/Button";
import SubTitleLabel from "../components/atoms/SubTitleLabel";

import { TaskCard } from '../components/TaskCard';
import { LoadingSpinner } from "../components/LoadingSpinner";

export function ProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { project } = location.state;

  // Statics
  const [amountTasks, setAmountTasks] = useState("");
  const [amountTasksCompleted, setAmountTasksCompleted] = useState("");


  const addNewTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const removeTask = (idToRemove) => {
    setTasks(tasks.filter((task) => task.id !== idToRemove));
  };

  useEffect(() => {
    async function getAllPjcts() {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token && id) {
        try {
          const res = await fetchTasksByProject(id, token);
          setTasks(res.data);
          setAmountTasks(res.data.length);
          setAmountTasksCompleted(res.data.filter(project => project.is_completed === true).length);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    }
    getAllPjcts();
  }, [id]);

  useEffect(() => {
    setTasks(tasks);
  }, [tasks])

  const backToHome = () => {
    navigate('/home');
  }

  const deleteMethod = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await deleteProject(project.id, token);
        navigate('/home');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="content">
      <div className="main-content-items">
        <div className="menu-project">
          <div className="menu-project">
            <button onClick={backToHome}><FaArrowLeft /></button>
            <TitleLabel label={project.project_name} />
            <span>in progress</span>
          </div>
          <EditProject project={project} updateDataProject={updateProject} />
        </div>

        <div className="cards-sections">

          {/* Project Description */}
          <div className="card-section">
            <TitleLabel label={'Project Description'} />
            <SubTitleLabel label={project.description} />
          </div>

          {/* Overall Progress */}
          <div className="card-section">
            <TitleLabel label={"Overall Progress"} />
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-bar-fill"
                  style={{
                    width: `${project.progress}%`,
                    // width: '50%'
                  }}></div>
              </div>
            </div>
            <SubTitleLabel label={`${project.progress}% completed`} />
          </div>

          {/* Tasks */}
          <div className="card-section">
            <div className="menu">
              <TitleLabel label={"Tasks"} />
              <CreateTask id_project={project.id} addNewTask={addNewTask} />
            </div>
            <div className="main-tasks">
              {loading && <LoadingSpinner />}
              {tasks.length > 0 ? (
                tasks.map((task) =>
                (<TaskCard key={task.id}
                  task={task}
                  removeTask={removeTask} />
                ))
              ) : (
                <SubTitleLabel label={'You need make some tasks'} />
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="card-section">
            <TitleLabel label={"Comments"} />
            <p>Coming soon</p>
          </div>
        </div>
      </div>
      {/* SIDEBAR */}
      <div className="side-bar-project">
        <div className="cards-sections">
          {/* DOCUMENT & FILES */}
          <div className="card-section">
            <TitleLabel label={'Documents & Files'} />
            <div className="files-items">
              <div className="file-item">
                <FaFile />
                <SubTitleLabel label={'projectko.pdf'} />
                <FaDownload />
              </div>
              <div className="file-item">
                <FaFile />
                <SubTitleLabel label={'projectko.pdf'} />
                <FaDownload />
              </div>
              <div className="file-item">
                <FaFile />
                <SubTitleLabel label={'projectko.pdf'} />
                <FaDownload />
              </div>
              <Button label={'Upload File'} />
            </div>            
          </div>

          {/* TEAM MEMBERS */}
          <div className="card-section">
            <TitleLabel label={'Team Members'} />
            <div className="members">
              <div className="member">
                EJ
              </div>
              <div className="member">
                ML
              </div>
              <div className="member">
                AM
              </div>
              <div className="member">
                <FaPlus/>
              </div>
            </div>
          </div>

          {/* PROJECTS STATICS */}
          <div className="card-section">
            <TitleLabel label={'Project Stadistics'} />
            <div className="stadistic-item">
              <SubTitleLabel label={'Total tasks:'} />
              <SubTitleLabel label={amountTasks} />
            </div>
            <div className="stadistic-item">
              <SubTitleLabel label={'Tasks completed:'} />
              <SubTitleLabel label={amountTasksCompleted} />
            </div>
            <div className="stadistic-item">
              <SubTitleLabel label={'Days remaining:'} />
              <SubTitleLabel label={amountTasks} />
            </div>
            <div className="stadistic-item">
              <SubTitleLabel label={'Team members:'} />
              <SubTitleLabel label={amountTasks} />
            </div>
          </div>
        </div>
        <div className="control-buttons">
          <div>
            <CreateTask id_project={project.id} addNewTask={addNewTask} />
          </div>
          <div>
            <button><FaPlus /> Generate Report</button>
          </div>
          <div>
            <Delete name={project.project_name} deleteMethod={deleteMethod} type={'Project'} />
          </div>
        </div>
      </div>
    </div>
  )
}