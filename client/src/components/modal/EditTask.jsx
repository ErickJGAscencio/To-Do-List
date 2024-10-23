import React, { useState, useEffect, useRef } from 'react';
// import './EditProject.css'
import { FaCircle, FaPalette, FaTrash } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa';

import { fetchSubTask, updateTask } from '../../api/todolist.api';

export function EditTask({ task, modifySubtaskList }) {
  const [idTask, setIdTask] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [subtasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);


  const [color, setColor] = useState();


  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    console.log(color);
    setIsMenuVisible(!isMenuVisible);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuVisible(false);
    }
  };

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

    setColor(task.color);
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
        color: color,
        subtasks: subtasks
      };
      const token = localStorage.getItem("token");
      const res = await updateTask(idTask, updatedData, token);
      modifySubtaskList(res);
      closeModal();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };



  const colors1 = ['#787878', '#C19F1A', '#3357FF', '#1E930E', '#177CB7'];

  const colors2 = ['#B51495', '#D9D9D9', '#E1BB23', '#4ADC37', '#DD40BE'];

  const colors3 = ['#D6C376', '#81D676', '#76B3D6', '#D676C3'];

  const setSelectedColor = (color) => {
    setColor(color);
  }



  return (
    <div>
      <FaPen onClick={openModal} />

      {isOpen && (
        <div className="modal">

          <div className="modal-content"
            style={{
              backgroundImage: `linear-gradient(to bottom, #2D2D2D, ${color})`
            }}
          >
            <div className="modal-header">
              <h1>Edit task</h1>
              <p className='button' onClick={toggleMenu}><FaPalette /></p>


              

{isMenuVisible && (
                <div className="context-menu" ref={menuRef}>
                  <p>Select color</p>
                  {colors1.map((color, index) => (
                    <div className="context-menu-item" onClick={toggleMenu}>
                      <FaCircle
                        key={index}
                        style={{ color: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    </div>
                  ))}
                  {colors2.map((color, index) => (
                    <div className="context-menu-item" onClick={toggleMenu}>
                      <FaCircle
                        key={index}
                        style={{ color: color }}
                      onClick={() => setSelectedColor(color)}
                      />
                    </div>
                  ))}
                  {colors3.map((color, index) => (
                    <div className="context-menu-item" onClick={toggleMenu}>
                      <FaCircle
                        key={index}
                        style={{ color: color }}
                      onClick={() => setSelectedColor(color)}
                      />
                    </div>
                  ))}
                </div>
              )}






            </div>
            <div className="modal-body">
              <div className='left-section'>
                <h3 className='title-input'>Task name</h3>
                <input
                  className='modal-name-input'
                  type="text"
                  placeholder="e.g Do something"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
                <div className='modal-tasks'>
                  <h3 className='label-input'>
                    {taskName}
                    {taskName != "" && (
                      "'s "
                    )}
                    Subtasks
                  </h3>
                  <div className='add-controller'>
                    <p className="button" onClick={addSubTask}>Add</p> {/*CAMBIAR <button> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
                    <input
                      className='modal-name-input'
                      type="text"
                      placeholder="Subtask Name"
                      value={newSubTask}
                      onChange={(e) => setNewSubTask(e.target.value)}
                    />

                  </div>
                  <h3 className='label-input'>Subtask list</h3>
                  <div className='task-container'>
                    {subtasks.map((subtask, index) => (
                      <div key={subtask.id || index} className='task-item'>
                        {subtask.subtask_name || subtask}
                        <p className='button' onClick={() => removeSubTask(index)}><FaTrash /></p>{/*CAMBIAR <button> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='right-section'>
                <div className='description'>
                  <h1 className='title-input'>Description</h1>
                  <textarea
                    placeholder="Task Description"
                    value={taskDescription || ""}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <p className='button' onClick={pdtTask}>Save</p>{/*CAMBIAR <p> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
              <p className='button' onClick={closeModal}>Cancel</p>{/*CAMBIAR <button> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTask;
