import "../../pages/ProjectPage.css";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from "react"
// API
import { createComment, deleteProject, fetchComments, fetchTasksByProject, updateProject } from "../../api/todolist.api";
// Icons
import { FaArrowLeft, FaChartBar, FaDownload, FaFile, FaPlus, FaUpload } from "react-icons/fa";
// Modal
import { CreateTask } from '../../components/modal/CreateTask';
import Delete from "../../components/modal/Delete";
import EditProject from "../../components/modal/EditProject";
// Atoms
import TitleLabel from "../../components/atoms/TitleLabel";
import SubTitleLabel from "../../components/atoms/SubTitleLabel";
// Molecules
import ProgressLabel from "../../components/molecules/ProgressLabel";

import { AuthContext } from "../../context/AuthContext";
import ProjectStadistics from "../organisims/ProjectStadistics";
import ProjectMembers from "../organisims/ProjectMembers";
import ProjectTasks from "../organisims/ProjectTasks";
import ProjectFiles from "../organisims/ProjectFiles";
import MenuProject from "../organisims/MenuProject";
import InformationProject from "../organisims/InformationProject";
import CommentsProject from "../organisims/CommentsProject";


function ProjectPageTemplate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = location.state;

  const { userId } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusProject, setStatusProject] = useState();
  //Comments
  const [comments, setComments] = useState([]);
  // Statics
  const [projectProgress, setProjectProgress] = useState(project.progress || 0);
  const [amountTasks, setAmountTasks] = useState("");
  const [amountTasksCompleted, setAmountTasksCompleted] = useState("");

  const isOwner = project.user === userId;

  const [files, setFiles] = useState([]);

  const getDaysLeft = (dueDate) => {
    // Convertir la fecha de vencimiento y la fecha actual en milisegundos
    const dueDateMs = new Date(dueDate).getTime();
    const todayMs = new Date().getTime();

    // Calcular la diferencia en milisegundos y convertir a días
    const diffDays = Math.ceil((dueDateMs - todayMs) / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const daysLeft = getDaysLeft(project.due_date);


  const addNewTask = (newTask) => {
    setTasks([...tasks, newTask]);
    updateProgressAndStatistics();
  };

  const removeTask = (idToRemove) => {
    setTasks(tasks.filter((task) => task.id !== idToRemove));
    updateProgressAndStatistics();
  };

  //Progress and Stadistics
  const updateProgressAndStatistics = async () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.is_completed).length;

    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    setAmountTasks(totalTasks);
    setAmountTasksCompleted(completedTasks);
    setProjectProgress(progress.toFixed(1));
    GetStatusProject();
  };

  useEffect(() => {
    GetProjectStadistics();
  }, [tasks]);

  const GetProjectStadistics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.is_completed).length;

    setAmountTasks(totalTasks);
    setAmountTasksCompleted(completedTasks);
    GetStatusProject();
  };

  const GetStatusProject = () => {
    let gotStatus = 1;
    const progress = parseFloat(project.progress);

    switch (progress) {
      case (100): gotStatus = 3;
        break;
      case (25): gotStatus = 2;
        break;
      default: gotStatus = 1;
        break;
    }
    setStatusProject(gotStatus);
  };

  useEffect(() => {
    updateProgressAndStatistics();
  }, [tasks, projectProgress]);

  const completeTask = async (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id == taskId ? { ...task, is_completed: !task.is_completed } : task
      )
    );
    updateProgressAndStatistics();
  };


  useEffect(() => {
    async function getAllTasks() {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token && project.id) {
        try {
          // Obtener las tareas
          const resTasks = await fetchTasksByProject(project.id, token);
          setTasks(resTasks.data);
          setMembers(project.team_members);

          setLoading(false);
          updateProgressAndStatistics();
        } catch (error) {
          console.error(error);
        } finally {
          GetStatusProject();
        }
      }
    }
    getAllTasks();
  }, [project.id]);




  const handleDeleteProject = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await deleteProject(project.id, token);
        backToHome()
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    // if (file) {
    //   try {
    //     // Supongamos que uploadFile maneja la lógica de subida 
    //     await uploadFile(file);
    setFiles([...files, { name: file.name }]);
    //     // Añade el nuevo archivo a la lista 
    //   } catch (error) {
    //     console.error('Error uploading file:', error);
    //   }
    // }
  };

  return (
    <div className="content">
      <div className="main-content-items">
        <MenuProject project={project} statusProject={statusProject} />       
        
        <div className="cards-sections">
          <InformationProject project={project} projectProgress={projectProgress} />

          <ProjectTasks
            id_project={project.id}
            tasks={tasks}
            addNewTask={addNewTask}
            removeTask={removeTask}
            completeTask={completeTask}
          />

          <CommentsProject project={project} />
        </div>
      </div>
      {/* SIDEBAR */}
      <div className="side-bar-project">
        <div className="cards-sections">
          {/* DOCUMENT & FILES */}
          <ProjectFiles
            files={files}
            handleFileChange={handleFileChange} />

          {/* TEAM MEMBERS */}
          <ProjectMembers
            userId={userId}
            members={members} />

          {/* PROJECTS STATICS */}
          <ProjectStadistics
            amountTasks={amountTasks}
            amountTasksCompleted={amountTasksCompleted}
            daysLeft={daysLeft} />
        </div>
        <div className="control-buttons">
          <div>
            <CreateTask id_project={project.id} addNewTask={addNewTask} classStyle={'black-button'} />
          </div>
          {/* <div>
            <button className="white-button"><FaChartBar /> Generate Report</button>
          </div> */}
          {isOwner && (
            <div>
              <Delete classStyle={"white-button"} name={project.project_name} deleteMethod={handleDeleteProject} type={'Project'} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectPageTemplate;