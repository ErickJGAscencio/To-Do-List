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
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [refreshComments, setRefreshComments] = useState(true);
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
    setProjectProgress(progress);
    GetStatusProject();
    // Actualiza el progreso en la base de datos
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const updateData = {
          progress: progress
        }
        await updateProject(project.id, updateData, token);
        console.log("Project progress updated successfully!");
      } catch (error) {
        console.error("Error updating project progress:", error);
      }
    }
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

  //Comments
  useEffect(() => {
    async function getAllComments() {
      const token = localStorage.getItem('token');
      if (token && project.id) {
        try {
          const response = await fetchComments(project.id, token);
          setComments(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    }
    if (refreshComments) {
      getAllComments();
      setRefreshComments(false);
    }
  }, [project.id, refreshComments]);

  const postComment = async () => {
    if (comment && comment != null) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await createComment(id, token, comment);
          setComments((prevComments) => [...prevComments, response.data]);
          setComment("");
          setRefreshComments(true);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      console.log("empty comment");
    }
  };

  const backToHome = () => {
    navigate('/home');
  }

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
        <div className="menu-project">
          <div className="menu-group">
            <button className={'blue-button'} onClick={backToHome}><FaArrowLeft /></button>
            <TitleLabel label={project.project_name} />
            <ProgressLabel status={statusProject} />
          </div>
          <EditProject project={project} updateDataProject={console.log} />
        </div>

        <div className="cards-sections">
          {/* Project Description */}
          <div className="card-section">
            <TitleLabel label={'Project Description'} />
            <SubTitleLabel label={project.description} />
          </div>

          {/* Overall Progress */}
          <div className="card-section">
            <TitleLabel label={"Overall Progress"} />
            <div className="progress-section">
              <div className="progress-bar">
                <div className="progress-bar-fill"
                  style={{ width: `${projectProgress}%` }}
                ></div>
              </div>
            </div>
            <SubTitleLabel label={`${projectProgress}% completed`} />
          </div>

          {/* Tasks */}
          <ProjectTasks
            id_project={project.id}
            tasks={tasks}
            addNewTask={addNewTask}
            removeTask={removeTask}
            completeTask={completeTask}
          />

          {/* Comments */}
          <div className="card-section">
            <TitleLabel label={"Comments"} />
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.slice().reverse().map(comment => (
                  <div key={comment.id} className="comment">
                    <p><strong>{comment.user}</strong>: {comment.comment}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet</p>
              )}
            </div>
            <hr />
            <div className="comment-adding">
              <input
                type="text"
                placeholder="Add comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)} />

              <button className={"blue-button"} onClick={postComment} >Post</button>
            </div>
          </div>
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
          <div>
            <button className="white-button"><FaChartBar /> Generate Report</button>
          </div>
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