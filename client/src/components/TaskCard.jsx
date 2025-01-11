import { useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { deleteTask, updateTask } from '../api/todolist.api';
import { EditTask } from './modal/EditTask';
import SubTitleLabel from './atoms/SubTitleLabel';
import ProjectContext from '../context/ProjectContext';

export function TaskCard({ task, removeTask, completeTask }) {
  const { members } = useContext(ProjectContext);
  const [memberAssigned, setMemberAssigned] = useState("");
  const [isDescriptionVisible, setDescriptionVisibility] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  
  useEffect(() => {
    if (task.assign_to) {
      setMemberAssigned(members.find(member => member.id === task.assign_to));      
    }
  },[])

  const updateTaskData = (updatedTask) => {
    setCurrentTask(updatedTask);
  };
    
  const handleCheckStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const updatedData = {
          is_completed: !currentTask.is_completed
        };
        setCurrentTask({ ...currentTask, ...updatedData });
        await updateTask(currentTask.id, updatedData, token);
        
      } catch (error) {
        console.error('Error updating task status:', error);
      } finally {
        completeTask(currentTask.id);
      }
    }
  };

  const toggleDescriptionVisibility = () => {
    setDescriptionVisibility(!isDescriptionVisible);
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
        console.error('Error deleting task:', error);
      }
    }
  }

  return (
    <div className="card-task">
      <div className='card-task-info'>
        <div className='task-items'>
          <FaCheckCircle
            onClick={handleCheckStatus}
            color={currentTask.is_completed ? 'black' : 'gray'}
          />
          <div>{currentTask.task_name}</div>
        </div>
        <div className='task-items'>
          {memberAssigned && (
            <h6>Assign to { memberAssigned.username }</h6>
          )}
          <SubTitleLabel className='due-date' label={'Due: 2023-12-31'} />
          <div onClick={toggleDescriptionVisibility}>
            {isDescriptionVisible ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
      </div>
      {isDescriptionVisible && (
        <div className='card-task-description'>
          <SubTitleLabel label={currentTask.description} />
          <div className='card-task-controls'>
            {/* <EditTask task={task} modifySubtaskList={modifySubtaskData} /> */}
            <EditTask task={currentTask} updateTaskData={updateTaskData} />
            <button className={'black-button'} onClick={deleteMethod}> <FaTrash /></button>
          </div>
        </div>
      )}
    </div>
  );
}
