import './ProjectCard.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteProject, fetchTasksByProject } from '../api/todolist.api';
import { EditProject } from './modal/EditProject';
import { Delete } from './modal/Delete';

export function ProjectCard({ project, updateDataProject, removeProject }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const { setSection } = useContext(AuthContext);

  const deleteMethod = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        removeProject(project.id);
        await deleteProject(project.id, token);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const setStatusTask = () => {
    if (progress == 100) {
      console.log("IsCompleted: " + project.project_name);

      //VAMOS BIEN SOLO HAY QUE DETALLAR ALGONOS PUNTOS DEL RENDERIZADO Y MANDAR A ACTUALIZAR EL ESTADO DE LA TAREA
    } else {
      console.log("IsNotCompleted: " + project.project_name);
    }
  }

  const calculateProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completedtasks = tasks.filter(task => task.is_completed).length;
    const progress = (completedtasks / tasks.length) * 100;
    return parseFloat(progress.toFixed(0));
  };

  useEffect(() => {
    async function getAllTasks() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetchTasksByProject(project.id, token);

          if (response.data && response.data.length > 0) {
            setTasks(response.data);
            setProgress(project.progress);
          }
        } catch (error) {
          console.error('Error getting task:', error);
        }
      }
    }
    getAllTasks();
  }, [project]);

  useEffect(() => {
    setProgress(calculateProgress(tasks));
    setStatusTask();
  }, [tasks, progress]);

  return (
    <div>
      <div className="card">
        <h4>{project.project_name}</h4>
        <div className='action-btn'>
          <EditProject project={project} updateDataProject={updateDataProject} />
          <Delete name={"project " + project.project_name} deleteMethod={deleteMethod} />
        </div>
        <div className="click-zone" onClick={() => {
          navigate(`/project/${project.id}`);
          setSection(project.project_name);
        }} >
          <div className="content-section">
            <p>{project.description}</p>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div>{progress || 0}%</div>
        </div>
      </div>
    </div>
  )
}