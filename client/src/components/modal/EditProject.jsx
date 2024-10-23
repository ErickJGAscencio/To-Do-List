// import './EditProject.css'
import React, { useState, useEffect, useRef } from 'react';
import { FaCircle, FaPalette, FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { fetchTasksByProject, updateProject } from '../../api/todolist.api';
import { ContextMenuColors } from '../ContextMenuColors';

export function EditProject({ project, updateDataProject }) {
  const [idProject, setIdProject] = useState("");
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [color, setColor] = useState();


  const menuRef = useRef(null);

  useEffect(() => {
    async function getAllTasks() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetchTasksByProject(project.id, token);

          if (response.data && response.data.length > 0) {
            setTasks(response.data);
          }
        } catch (error) {
          console.error('Error getting task:', error);
        }
      }
    }
    getAllTasks();
  }, [project]);

  const closeModal = () => {
    setIsOpen(false);
    setTitleProject("");
    setDescriptionProject("");
    // setTasks([]);
  };

  const openModal = async () => {
    console.log("Open modal");
    setColor(project.color);
    setIsOpen(true);
    setIdProject(project.id);
    setTitleProject(project.project_name);
    setDescriptionProject(project.description);
  };

  const addTask = () => {
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const pdtProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const newData = {
        project_name: titleProject,
        description: descripcionProject,
        color: color,
        tasks: tasks
      };

      const response = await updateProject(idProject, newData, token);

      const updatedData = {
        id: response.id,
        ...newData
      };

      updateDataProject(updatedData);
      closeModal();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const setSelectedColor = (color) => {
    setColor(color);
  }

  return (
    <div >
      <div onClick={openModal}>
        <FaPen />
      </div>
      {isOpen && (
        <div className="modal">
          <div className="modal-content"
            style={{
              backgroundImage: `linear-gradient(to bottom, #2D2D2D, ${color})`
            }}
          >
            <div className="modal-header">
              <h2>Edit project</h2>
              <ContextMenuColors menuRef={menuRef} setSelectedColor={setSelectedColor} />
            </div>
            <div className="modal-body">
              <div className='left-section'>
                <h1 className='title-input'>Project name</h1>
                <input
                  className='modal-name-input'
                  type="text"
                  placeholder="eg. BioApp"
                  value={titleProject}
                  onChange={(e) => setTitleProject(e.target.value)}
                />
                <div className='modal-tasks'>
                  <h3 className="label-input">Task's project</h3>
                  <div className='add-controller'>
                    <p className="button" onClick={addTask}><FaPlus/></p>
                    <input
                      className='modal-name-input'
                      type="text"
                      placeholder="Task Name"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                  </div>
                  <h3 className="label-input">Task List</h3>
                  <div className='task-container'>
                    {tasks.map((task, index) => (
                      <div key={task.id || index} className='task-item'>
                        {task.task_name || task}
                        <p className="button" onClick={() => removeTask(index)}><FaTrash/></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='right-section'>
                <div className='description'>
                  <h1 className='title-input'>Description</h1>
                  <textarea
                    placeholder="Project Description"
                    value={descripcionProject}
                    onChange={(e) => setDescriptionProject(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <p className="button" onClick={pdtProject}>Save</p>
              <p className="button" onClick={closeModal}>Cancel</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProject;
