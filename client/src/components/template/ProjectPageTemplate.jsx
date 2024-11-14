import "../../pages/ProjectPage.css";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from "react"
// API
import { createComment, deleteProject, fetchComments, fetchTasksByProject, updateProject } from "../../api/todolist.api";
// Icons
import { FaArrowLeft, FaDownload, FaFile, FaPlus } from "react-icons/fa";
// Modal
import { CreateTask } from '../../components/modal/CreateTask';
import Delete from "../../components/modal/Delete";
import EditProject from "../../components/modal/EditProject";
// Atoms
import TitleLabel from "../../components/atoms/TitleLabel";
import Button from "../../components/atoms/Button";
import SubTitleLabel from "../../components/atoms/SubTitleLabel";
// Molecules
import ProgressLabel from "../../components/molecules/ProgressLabel";

import { TaskCard } from '../../components/TaskCard';
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/AuthContext";


function ProjectPageTemplate() {
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { project } = location.state;
  const [statusProject, setStatusProject] = useState();

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Statics
  const [amountTasks, setAmountTasks] = useState("");
  const [amountTasksCompleted, setAmountTasksCompleted] = useState("");

  // console.log("Id user:" + userId);
  // console.log("Id project:" + project.user);
  const isOwner = project.user === userId;

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
  };

  const removeTask = (idToRemove) => {
    setTasks(tasks.filter((task) => task.id !== idToRemove));
  };

  const GetStatusProject = () => {
    let gotStatus = 1;
    const progress = parseFloat(project.progress);

    switch (true) {
      case (progress >= 100): gotStatus = 3;
        break;
      case (progress >= 25): gotStatus = 2;
        break;
      default: gotStatus = 1;
        break;
    }

    setStatusProject(gotStatus);
  };


  useEffect(() => {
    async function getAllData() {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token && id) {
        try {
          // Obtener las tareas
          const resTasks = await fetchTasksByProject(id, token);
          setTasks(resTasks.data);
          setAmountTasks(resTasks.data.length);
          setAmountTasksCompleted(resTasks.data.filter(project => project.is_completed === true).length);
          GetStatusProject();
          // Obtener los comentarios
          const resComments = await fetchComments(id, token);
          setComments(resComments.data);

          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    }
    getAllData();
  }, [id]);

  useEffect(() => {
    setTasks(tasks);
  }, [tasks])

  const backToHome = () => {
    navigate('/home');
  }

  const deleteMethod = async () => {
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

  const postComment = async () => {
    if (comment != "") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await createComment(id, token, comment);
  
          // Agrega el nuevo comentario al estado `comments`
          setComments(prevComments => [...prevComments, response.data]);
  
          setComment("");
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      console.log("empty comment");
    }
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
          <EditProject project={project} updateDataProject={updateProject} />
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
                  style={{
                    width: `${project.progress}%`,
                    // width: '50%'
                  }}></div>
              </div>
            </div>
            <SubTitleLabel label={`${project.progress}% completed`} />
          </div>

          {/* Tasks */}
          <div className="card-section">
            <div className="menu">
              <TitleLabel label={"Tasks"} />
              <CreateTask id_project={project.id} addNewTask={addNewTask} classStyle={'blue-button'} />
            </div>
            <div className="main-tasks">
              {loading && <LoadingSpinner />}
              {tasks.length > 0 ? (
                tasks.map((task) =>
                (<TaskCard key={task.id}
                  task={task}
                  removeTask={removeTask} />
                ))
              ) : (
                <SubTitleLabel label={'You need make some tasks'} />
              )}
            </div>
          </div>

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

              {/* <Button label={'Postear'} onClick={postComment} /> */}
              <button className={ "blue-button" } onClick={postComment} >Post</button>
            </div>
          </div>
        </div>
      </div>
      {/* SIDEBAR */}
      <div className="side-bar-project">
        <div className="cards-sections">
          {/* DOCUMENT & FILES */}
          <div className="card-section">
            <TitleLabel label={'Documents & Files'} />
            <div className="files-items">
              <div className="file-item">
                <SubTitleLabel label={<FaFile />} />
                <SubTitleLabel label={'projectko.pdf'} />
                <SubTitleLabel label={<FaDownload />} />
              </div>
              <div className="file-item">
                <SubTitleLabel label={<FaFile />} />
                <SubTitleLabel label={'projectko.pdf'} />
                <SubTitleLabel label={<FaDownload />} />
              </div>
              <div className="file-item">
                <SubTitleLabel label={<FaFile />} />
                <SubTitleLabel label={'projectko.pdf'} />
                <SubTitleLabel label={<FaDownload />} />
              </div>

              <Button classStyle={'black-button'} label={'Upload File'} />
            </div>
          </div>

          {/* TEAM MEMBERS */}
          <div className="card-section">
            <TitleLabel label={'Team Members'} />
            <div className="members">
              <div className="member">
                EJ
              </div>
              <div className="member">
                ML
              </div>
              <div className="member">
                AM
              </div>
              <div className="member">
                <FaPlus />
              </div>
            </div>
          </div>

          {/* PROJECTS STATICS */}
          <div className="card-section">
            <TitleLabel label={'Project Stadistics'} />
            <div className="stadistic-item">
              <SubTitleLabel label={'Total tasks:'} />
              <SubTitleLabel label={amountTasks} />
            </div>
            <div className="stadistic-item">
              <SubTitleLabel label={'Tasks completed:'} />
              <SubTitleLabel label={amountTasksCompleted} />
            </div>
            <div className="stadistic-item">
              <SubTitleLabel label={'Days remaining:'} />
              <SubTitleLabel label={daysLeft} />
            </div>
            <div className="stadistic-item">
              <SubTitleLabel label={'Team members:'} />
              <SubTitleLabel label={amountTasks} />
            </div>
          </div>
        </div>
        <div className="control-buttons">
          <div>
            <CreateTask id_project={project.id} addNewTask={addNewTask} classStyle={'black-button'} />
          </div>
          <div>
            <button className="white-button"><FaPlus /> Generate Report</button>
          </div>
          {isOwner && (
          <div>
            <Delete classStyle={"white-button"} name={project.project_name} deleteMethod={deleteMethod} type={'Project'} />
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectPageTemplate;