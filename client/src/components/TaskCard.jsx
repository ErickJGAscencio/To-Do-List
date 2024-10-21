import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaEllipsisH, FaPlus, FaTrash } from 'react-icons/fa';
import { deleteTask, fetchSubTask, updateSubtask, updateTask } from '../api/todolist.api';
import { CreateSubTask } from './modal/CreateSubTask';
import { Delete } from './modal/Delete';
import { EditTask } from './modal/EditTask';
import { SubTaskCard } from './SubTaskCard';
import { ContextMenu } from './ContextMenu';

export function TaskCard({ task, removeTask }) {
  const [subtasks, setSubTasks] = useState([]);
  const [progress, setProgress] = useState(0);
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

  const addNewSubTask = (newSubTask) => {
    setSubTasks([...subtasks, newSubTask]);
    calculateProgress([...subtasks, newSubTask]);
  };

  const removeSubTask = (idToRemove) => {
    setSubTasks(subtasks.filter((subtask) => subtask.id !== idToRemove));
    calculateProgress(subtasks.filter((subtask) => subtask.id !== idToRemove));
  };

  const modifySubtaskData = (data) => {
    if (data.subtasks) {
      // Si hay subtasks, actualiza la tarea y la lista de subtareas
      console.log(data);
      task.task_name = data.task_name;
      task.description = data.description;
      setSubTasks(data.subtasks);
      calculateProgress(data.subtasks);
    } else {
      // Si no hay subtasks, actualiza solo la subtarea
      const subtaskList = [...subtasks];
      const index = subtaskList.findIndex(subtask => subtask.id === data.id);
      if (index !== -1) {
        subtaskList[index] = data; // Pasa los datos modificados
        setSubTasks(subtaskList);
        calculateProgress(subtaskList);
      }
    }
  };

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

  const setStatusTask = async (isCompleted) => {
    const token = localStorage.getItem("token");
    const updatedData = { is_completed: isCompleted };

    try {
      await updateTask(task.id, updatedData, token);
      console.log({
        "Status task: ": isCompleted,
        "progress": progress,
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const calculateProgress = (subtasks) => {
    if (subtasks.length === 0) {
      setProgress(0);
      setStatusTask(false); // Si no hay subtareas, no está completada
      return;
    }
    
    const completedSubtasks = subtasks.filter(subtask => subtask.is_completed).length;
    const newProgress = (completedSubtasks / subtasks.length) * 100;
    
    setProgress(newProgress);
    // console.log("1-"+newProgress);

    // Solo actualiza el estado de la tarea SI ha cambiado
    if (newProgress === 100) {
      setStatusTask(true);
    } else {
      setStatusTask(false);
    }
  };

  useEffect(() => {
    async function getAllSubTasks() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetchSubTask(task.id, token);
          if (response.data && response.data.length > 0) {
            setSubTasks(response.data);
            calculateProgress(response.data);
          }
        } catch (error) {
          console.error('Error getting project:', error);
        }
      }
    }
    getAllSubTasks();
  }, [task]);

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
          {/* <ContextMenu
            isVisible={isMenuVisible}
            toggleMenu={toggleMenu}
            menuRef={menuRef}
          >
            <div className="context-menu-item">
              <CreateSubTask task={task} addNewSubTask={addNewSubTask} />
            </div>
            <div className="context-menu-item">
              <EditTask task={task} modifySubtaskList={modifySubtaskData} />
            </div>
            <div className="context-menu-item">
              <Delete name={"task " + task.task_name} deleteMethod={deleteMethod} />
            </div>
          </ContextMenu> */}
      
        </div>
        {isMenuVisible && (
          <div className="context-menu" ref={menuRef}>
            <div className="context-menu-item">
              <CreateSubTask task={task} addNewSubTask={addNewSubTask} />
            </div>
            <div className="context-menu-item">
              <EditTask task={task} modifySubtaskList={modifySubtaskData} />
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
          {subtasks.length === 0 && (
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
            <SubTaskCard key={subtask.id} subtask={subtask} removeSubTask={removeSubTask} modifySubtask={modifySubtaskData} />
          ))}
        </div>
      )}
    </div>
  )
}
