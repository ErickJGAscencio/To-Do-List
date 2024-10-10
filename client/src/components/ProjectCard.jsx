import './ProjectCard.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteProject, fetchTasksByProject, updateProject } from '../api/todolist.api';
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

  const setStatusProject = async () => {
    let updatedData={};
    try {
      if (progress == 100) {
        updatedData = {
          is_completed: true
        };
      } else {
        updatedData = {
          is_completed: false
        };
      }
      const token = localStorage.getItem("token");
      const res = await updateProject(project.id, updatedData, token);
      // console.log(res);
    } catch (error) {
      console.error('Error updating project:', error);
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
    setStatusProject();
  }, [tasks, progress]);

  return (
    <div>
      <div className="card">
        <h4>{project.project_name}</h4>
        {/* <FaEllipsisH /> AGREGAR UNA OPCION QUE PERMITA VER LOS DETALLES EN RESUMEN DEL PROYECTO SIN TENER QUE ABIRLO*/} 
        <div className='action-btn'>
          <EditProject project={project} updateDataProject={updateDataProject} />
          <Delete name={"project " + project.project_name} deleteMethod={deleteMethod} />
        </div>
        <div className="click-zone" onClick={() => {
          navigate(`/home/myprojects/project/${project.id}`);
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