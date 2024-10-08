import './ProjectCard.css';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { EditProject } from './modal/EditProject';
import { useEffect, useState } from 'react';
import { deleteProject, fetchTasks } from '../api/todolist.api';

export function ProjectCard({ project, updateDataProject, removeProject }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);

  const dltProject = async () => {
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
          const response = await fetchTasks(project.id, token);

          if (response.data && response.data.length > 0) {
            setTasks(response.data);
            // console.log(response.data);
          }
        } catch (error) {
          console.error('Error getting task:', error);
        }
      }
    }
    getAllTasks();
    setProgress(calculateProgress(tasks));
  }, [project]);
  
  return (
    <div>
      <div className="card">
        <h4>{project.project_name}</h4>
        <div className='action-btn'>
          <FaTrash onClick={dltProject} />
          <EditProject project={project} updateDataProject={updateDataProject} />
        </div>
        <div className="click-zone"
          onClick={() => {
            navigate(`/project/${project.id}`)
          }}>
          <div className="content-section">
            <p>{project.description}</p>
          </div>

          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-bar-fill"></div>
            </div>
            <div>100%</div>
          </div>
        </div>
      </div>
    </div>
  )
}