import './ProjectCard.css';
import { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteProject, fetchTasksByProject, updateProject } from '../api/todolist.api';
import { FaEllipsisH } from 'react-icons/fa';
import { EditProject } from './modal/EditProject';
import { Delete } from './modal/Delete';
import { ContextMenu } from './ContextMenu';
import TitleLabel from './atoms/TitleLabel';
import SubTitleLabel from './atoms/SubTitleLabel';

export function ProjectCard({ project, updateDataProject, removeProject }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [tasksRemaining, setTasksRemaining] = useState([]);
  const [progress, setProgress] = useState(0);
  const { setSection } = useContext(AuthContext);

  const menuRef = useRef(null);

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
    setTasksRemaining(completedTasks);
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
    <div className='card' onClick={() => {
      navigate(`/home/project/${project.id}`, {state:{project}});
      // setSection(project.project_name);
    }}>
      <div className='top-side'>
        <TitleLabel label={project.project_name} />
      </div>
      <div className='bottom-side'>
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className='progress-info'>
        <SubTitleLabel label={"Due: 2024-02-08"} />
        <SubTitleLabel label={`${tasksRemaining} tasks remaining`} />
        </div>
      </div>
    </div>
  );
}
