import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { deleteTask, fetchSubTask, updateTask } from '../api/todolist.api';
import { CreateSubTask } from './modal/CreateSubTask';
import { Delete } from './modal/Delete';
import { EditTask } from './modal/EditTask';
import { SubTaskCard } from './SubTaskCard';
import { ContextMenu } from './ContextMenu';
import SubTitleLabel from './atoms/SubTitleLabel';

export function TaskCard({ task, removeTask }) {
  const [subtasks, setSubTasks] = useState([]);
  const [progress, setProgress] = useState(0);
  const menuRef = useRef(null);


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
      task.color = data.color;
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

    console.log("Is Task " + task.task_name + " completed? " + isCompleted);
    try {
      await updateTask(task.id, updatedData, token);
      console.log({
        "task-name": task.task_name,
        "Status task": isCompleted,
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

    console.log("calculateProgress");
    console.log(subtasks);
    const completedSubtasks = subtasks.filter(subtask => subtask.is_completed).length;
    console.log(completedSubtasks);
    const newProgress = (completedSubtasks / subtasks.length) * 100;

    console.log("Old progress " + progress);
    setProgress(newProgress);
    console.log("New progress " + newProgress);

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


  const [isDescriptionVisible, setDescriptionVisibility] = useState(false);

  const toggleDescriptionVisibility = () => {
    setDescriptionVisibility(!isDescriptionVisible);

  };

  return (
    <div className="card-task">
      <div className='card-task-info'>
        <div>
          <FaCheckCircle />
          <div>{task.task_name}</div>
        </div>
        <div>
          <div className='due-date' >Due Date: 2023-12-31</div>
          <div onClick={toggleDescriptionVisibility} >
            {isDescriptionVisible ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
      </div>
      {isDescriptionVisible && (
        <div className='card-task-description'>
          <SubTitleLabel label={task.description} />

          <FaEdit />
        </div>
      )}

    </div>
  );
}
