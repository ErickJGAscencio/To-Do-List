import "./ProjectPage.css";

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react"

import { CreateTask } from '../components/modal/CreateTask';
import { TaskCard } from '../components/TaskCard';
import { deleteProject, fetchTasksByProject, updateProject } from "../api/todolist.api";
import { FaArrowLeft, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { Sidebar } from "../components/Sidebar";
import TitleLabel from "../components/atoms/TitleLabel";
import Button from "../components/atoms/Button";
import SubTitleLabel from "../components/atoms/SubTitleLabel";
import EditProject from "../components/modal/EditProject";
import Delete from "../components/modal/Delete";

export function ProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);

  const location = useLocation();
  const { project } = location.state;

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
          <p><EditProject project={project} updateDataProject={updateProject} /></p>
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
              {tasks.length > 0 ? (
                tasks.map((task) =>
                (<TaskCard key={task.id}
                            task={task}
                  removeTask={removeTask} />
                ))
              ) : (
                <SubTitleLabel label={'You need make some tasks'}/>
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
            <div>
              <SubTitleLabel label={'projectko.pdf'} />
              <SubTitleLabel label={'projectko.doc'} />
              <SubTitleLabel label={'projectko.fig'} />
            </div>
            <Button label={'Upload File'}/>
          </div>

          {/* TEAM MEMBERS */}
          <div className="card-section">
            <TitleLabel label={'Team Members'} />
            <p>Coming soon</p>
          </div>

          {/* PROJECTS STATICS */}
          <div className="card-section">
            <TitleLabel label={'Project Statics'} />
            <p>Coming soon</p>
          </div>
        </div>
        <div className="control-buttons">
          <div>
            <button><CreateTask id_project={project.id} addNewTask={addNewTask} /></button>
          </div>
          <div>
            <button><FaPlus /> Generate Report</button>
          </div>
          <div>
            <button><Delete name={project.project_name} deleteMethod={ deleteMethod } type={ 'Project' } /></button>
          </div>
        </div>
      </div>
    </div>
  )
}