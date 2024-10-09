import './TaskCard.css';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { deleteTask, fetchSubTask } from '../Api/todolist.api';
import { CreateSubTask } from './modal/CreateSubTask';
import { Delete } from './modal/Delete';
import { EditTask } from './modal/EditTask';
import { SubTaskCard } from './SubTaskCard';

export function TaskCard({ task, removeTask }) {
  const [subtasks, setSubTasks] = useState([]);
  const [progress, setProgress] = useState(0);


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

  const setStatusTask = () => {
    if (progress == 100) {
      console.log("IsCompleted: " + task.task_name);

      //VAMOS BIEN SOLO HAY QUE DETALLAR ALGONOS PUNTOS DEL RENDERIZADO Y MANDAR A ACTUALIZAR EL ESTADO DE LA TAREA
    } else {
      console.log("IsNotCompleted: " + task.task_name);
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
          const id = task.id;
          const res = await fetchSubTask(id, token);

          if (res.data && res.data.length > 0) {
            setSubTasks(res.data);
            setProgress(task.progress);
          }
        } catch (error) {
          console.error(error);
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

  return (
    <div className="task-card-content">
      <div className="task-card">
        <div className='task-info'>
          <div className='task-name'>{task.task_name}</div>
          <p>{task.description}</p>
        </div>
        <div className='action-btn'>
          <button><CreateSubTask task={task} addNewSubTask={addNewSubTask} /></button>
          <button><EditTask task={task} setSubTasksFrnt={setSubTasksFrnt} /></button>
          <Delete name={ "task " + task.task_name } deleteMethod={deleteMethod} />
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div>{progress || 0}%</div>  {/* Mostrar el porcentaje de progreso */}
        </div>
      </div>

      {subtasks.length > 0 && ( // Mostrar la sección de subtareas solo si existen
        <div className="content-section">
          {subtasks.map((subtask) => (
            <SubTaskCard key={subtask.id} subtask={subtask} removeSubTask={removeSubTask} setSubTaskFront={setSubTaskFront} />
          ))}
        </div>
      )}
    </div>
  )
}
