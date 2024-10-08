import React, { useState, useEffect } from 'react';
import './EditProject.css'
import { FaPalette, FaTrash } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa';

import { fetchSubTask, updateTask } from '../../api/todolist.api';

export function EditTask({ task , setSubTasksFrnt}) {
  const [idTask, setIdTask] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [subtasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function getAllSubTasks() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetchSubTask(task.id, token);

          if (res.data && res.data.length > 0) {
            setSubTasks(res.data);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    getAllSubTasks();
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    setTaskName("");
    setTaskDescription("");
    setSubTasks([]);
  };

  const openModal = async () => {
    setIsOpen(true);

    setIdTask(task.id);
    setTaskName(task.task_name);
    setTaskDescription(task.description);
  };

  const addSubTask = () => {
    if (newSubTask) {
      setSubTasks([...subtasks, newSubTask]);
      setNewSubTask("");
    }
  };

  const removeSubTask = (index) => {
    const updatedTasks = subtasks.filter((_, i) => i !== index);
    setSubTasks(updatedTasks);
  };

  const pdtTask = async () => {
    try {
      const updatedData = {
        task_name: taskName,
        description: taskDescription,
        subtasks: subtasks
      };
      const token = localStorage.getItem("token");
      const res = await updateTask(idTask, updatedData, token);
      setSubTasksFrnt(res);
      closeModal();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div>
      <FaPen onClick={openModal}/>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className='left-section'>
              <input
                className='pname-input'
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <div className='tasks'>
                <div className='add-controller'>
                  <input
                    type="text"
                    placeholder="Subtask Name"
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                  />
                  <button onClick={addSubTask}>Add</button> {/*CAMBIAR <button> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
                </div>
                <div className='task-container'>
                  {subtasks.map((subtask, index) => (
                    <div key={subtask.id || index} className='task-item'>
                      {subtask.subtask_name || subtask}
                      <button onClick={() => removeSubTask(index)}><FaTrash /></button>{/*CAMBIAR <button> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='right-section'>
              <button className='btn-color'>
                <FaPalette />
              </button>
              <div className='description'>
                <h1>Description</h1>
                <textarea
                  placeholder="Task Description"
                  value={taskDescription || ""}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </div>
              <div className='buttons-action'>
                <button onClick={pdtTask}>Edit</button>{/*CAMBIAR <button> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
                <button onClick={closeModal}>Cancel</button>{/*CAMBIAR <button> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTask;
