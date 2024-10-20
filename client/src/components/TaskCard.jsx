// import './TaskCard.css';
import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaEllipsisH, FaPlus, FaTrash } from 'react-icons/fa';
import { deleteTask, fetchSubTask, updateSubtask, updateTask } from '../api/todolist.api';
import { CreateSubTask } from './modal/CreateSubTask';
import { Delete } from './modal/Delete';
import { EditTask } from './modal/EditTask';
import { SubTaskCard } from './SubTaskCard';

export function TaskCard({ task, removeTask }) {
  const [subtasks, setSubTasks] = useState([]);
  const [progress, setProgress] = useState(0);

  // Estado para controlar la visibilidad del menú contextual
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuVisible(false);  // Cerrar el menú si se hace clic fuera de él
    }
  };

  const addNewSubTask = (newSubTask) => {
    setSubTasks([...subtasks, newSubTask]);
  };

  const removeSubTask = (idToRemove) => {
    setSubTasks(subtasks.filter((subtask) => subtask.id !== idToRemove));
  };

  const setSubTasksFrnt = (subtaskDataUpdate) => {
    task.task_name = subtaskDataUpdate.task_name;
    task.description = subtaskDataUpdate.description;
    setSubTasks(subtaskDataUpdate.subtasks);
  }

  const setSubTaskFront = (updatedSubtask) => {
    const updatedSubtasks = [...subtasks];
    const index = updatedSubtasks.findIndex(subtask => subtask.id === updatedSubtask.id);
    if (index !== -1) {
      updatedSubtasks[index] = updatedSubtask;
    }
    setSubTasks(updatedSubtasks);
  }

  const deleteMethod = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const id_task = task.id;

        const response = await deleteTask(id_task, token);
        if (response != null) {
          removeTask(id_task);
        }

      } catch (error) {
        console.error(error);
      }
    }
  }

  const setStatusTask = async () => {
    let updatedData = {};
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

      await updateTask(task.id, updatedData, token);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  const calculateProgress = (subtasks) => {
    if (subtasks.length === 0) return 0;
    const completedSubtasks = subtasks.filter(subtask => subtask.is_completed).length;
    const progress = (completedSubtasks / subtasks.length) * 100;
    return parseFloat(progress.toFixed(0));
  };

  useEffect(() => {
    async function getAllSubTasks() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetchSubTask(task.id, token);

          if (response.data && response.data.length > 0) {
            setSubTasks(response.data);
            // console.log(response.data);
            setProgress(task.progress);
          }
        } catch (error) {
          console.error('Error getting project:', error);
        }
      }
    }
    getAllSubTasks();
  }, [task]);

  useEffect(() => {
    setSubTasks(subtasks);
    setProgress(calculateProgress(subtasks));
    setStatusTask();
  }, [subtasks, progress]);

  // Hook para manejar clics fuera del menú
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
    <div className="card-task">
      <div className="card">
        <div className="header-card">
          <div className='title-card'>{task.task_name}</div>
          <div className="button-menu" onClick={toggleMenu}> <FaEllipsisH /></div>
        </div>
        {isMenuVisible && (
          <div className="context-menu" ref={menuRef}>
            <div className="context-menu-item">
              <CreateSubTask task={task} addNewSubTask={addNewSubTask} />
            </div>
            <div className="context-menu-item">
              <EditTask task={task} setSubTasksFrnt={setSubTasksFrnt} />
            </div>
            <div className="context-menu-item">
              <Delete name={"task " + task.task_name} deleteMethod={deleteMethod} />
            </div>
          </div>
        )}
        <div className='content-section'>
          <div className="card-description">
            {task.description}
          </div>

          {subtasks.length == 0 && (
            <FaCheckCircle />
          )}


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

      {/* Mostrar Subtareas */}
      {subtasks.length > 0 && (
        <div className="content-subtask">
          {subtasks.map((subtask) => (
            <SubTaskCard key={subtask.id} subtask={subtask} removeSubTask={removeSubTask} setSubTaskFront={setSubTaskFront} />
          ))}
        </div>
      )}
    </div>
  )
}
