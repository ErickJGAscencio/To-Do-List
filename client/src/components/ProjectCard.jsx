import './ProjectCard.css';
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteProject, fetchTasksByProject, updateProject } from '../api/todolist.api';
import { FaEllipsisH } from 'react-icons/fa';
import { EditProject } from './modal/EditProject';
import { Delete } from './modal/Delete';
import { ContextMenu } from './ContextMenu';

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
    let updatedData = {
      progress: progress,
      is_completed: false
    };

    if (progress === 100) {
      updatedData = {
        progress: progress,
        is_completed: true
      };
    }

    const token = localStorage.getItem("token");
    await updateProject(project.id, updatedData, token);
  };

  const calculateProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.is_completed).length;
    const newProgress = (completedTasks / tasks.length) * 100;

    setProgress(newProgress);
  };


  useEffect(() => {
    const getAllTasks = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetchTasksByProject(project.id, token);
          if (response.data) {
            setTasks(response.data);
            calculateProgress(response.data);
          }
        } catch (error) {
          console.error('Error getting tasks:', error);
        }
      }
    };
    getAllTasks();
  }, [project]);

  useEffect(() => {
    setStatusProject();
  }, [progress])

  return (
    <div>
      <div className="card" style={{ backgroundColor: project.color }}>
        <div className="header-card">
          <div className='title-card'>{project.project_name}</div>
          <ContextMenu items={["Edit", "Delete"]} menuRef={menuRef}>
            <EditProject project={project} updateDataProject={updateDataProject} />
            <Delete name={"project " + project.project_name} deleteMethod={deleteMethod} />
          </ContextMenu>
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
