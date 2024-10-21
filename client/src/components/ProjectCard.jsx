import './ProjectCard.css';
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteProject, fetchTasksByProject, updateProject } from '../api/todolist.api';
import { FaEllipsisH } from 'react-icons/fa';
import { EditProject } from './modal/EditProject';
import { Delete } from './modal/Delete';

export function ProjectCard({ project, updateDataProject, removeProject }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const { setSection } = useContext(AuthContext);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuVisible(false);
    }
  };

  const deleteMethod = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await deleteProject(project.id, token);
        removeProject(project.id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const setStatusProject = async () => {
    const updatedData = {
      is_completed: progress === 100
    };

    const token = localStorage.getItem("token");
    try {
      await updateProject(project.id, updatedData, token);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const calculateProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.is_completed).length;
    return (completedTasks / tasks.length) * 100;
  };

  
  useEffect(() => {
    const getAllTasks = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetchTasksByProject(project.id, token);
          if (response.data) {
            setTasks(response.data);
            const newProgress = calculateProgress(response.data);
            setProgress(newProgress);
            if (newProgress !== progress) {
              setStatusProject(); // Llamar solo si el progreso ha cambiado
            }
          }
        } catch (error) {
          console.error('Error getting tasks:', error);
        }
      }
    };
    getAllTasks();
  }, [project]);

  useEffect(() => {
    setProgress(calculateProgress(tasks));
    if (progress !== calculateProgress(tasks)) {
      setStatusProject();
    }
  }, [tasks]);

  useEffect(() => {
    if (isMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible]);

  return (
    <div>
      <div className="card" style={{ backgroundColor: project.color }}>
        <div className="header-card">
          <div className='title-card'>{project.project_name}</div>
          <div className="button-menu" onClick={toggleMenu}>
            <FaEllipsisH />
          </div>
          {isMenuVisible && (
            <div className="context-menu" ref={menuRef}>
              <div className="context-menu-item">
                <EditProject project={project} updateDataProject={updateDataProject} />
              </div>
              <div className="context-menu-item">
                <Delete name={"project " + project.project_name} deleteMethod={deleteMethod} />
              </div>
            </div>
          )}
        </div>
        <div className="click-zone" onClick={() => {
          navigate(`/home/project/${project.id}`);
          setSection(project.project_name);
        }}>
          <div className="content-section">
            <div className="card-description">
              {project.description}
            </div>
          </div>
        </div>
      </div>
      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div>{progress.toFixed(0) || 0}%</div>
      </div>
    </div>
  );
}
