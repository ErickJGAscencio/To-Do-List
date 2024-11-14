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
import ProgressLabel from './molecules/ProgressLabel';

export function ProjectCard({ project, updateDataProject, removeProject }) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [tasksRemaining, setTasksRemaining] = useState([]);
  const [progress, setProgress] = useState(0);
  const [statusProject, setStatusProject] = useState();

  const menuRef = useRef(null);

  const GetStatusProject = () => {
    let gotStatus = 1; 
    const progress = parseFloat(project.progress);

    switch (true) {
      case (progress >= 100): gotStatus = 3; 
        break;
      case (progress >= 25): gotStatus = 2;
        break;
      default: gotStatus = 1; 
        break;
    }

    setStatusProject(gotStatus); 
  };


  const calculateProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.is_completed).length;

    const incompletedTasks = tasks.filter(task => !task.is_completed).length;
    setTasksRemaining(incompletedTasks);
    
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
            GetStatusProject();
          }
        } catch (error) {
          console.error('Error getting tasks:', error);
        }
      }
    };
    getAllTasks();
  }, [project]);

  // useEffect(() => {
  //   setStatusProject();
  // }, [progress])

  return (
    <div className='card' onClick={() => {
      navigate(`/home/project/${project.id}`, {state:{project}});
      // setSection(project.project_name);
    }}>
      <div className='top-side'>
        <TitleLabel label={project.project_name} />
        <ProgressLabel status={statusProject} /></div>
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
