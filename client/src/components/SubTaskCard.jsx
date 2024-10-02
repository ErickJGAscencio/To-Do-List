import "../components/SubTaskCard.css"
import { FaTrash, FaCheckCircle } from 'react-icons/fa';
import { deleteSubTask } from "../Api/todolist.api";
import EditSubTask from "./modal/EditSubTask";

export function SubTaskCard({ subtask, removeSubTask }) {


  const dltSubTask = async () => {
    try {
      const id_subtask = subtask.id;

      const response = await deleteSubTask(id_subtask);
      if (response != null) {
        removeSubTask(id_subtask)
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="subtask-card">
        <div className="action-btn">
          <button><FaCheckCircle /></button>
          <button><EditSubTask subtask={subtask} /></button>
          <button><FaTrash onClick={dltSubTask} /></button>
        </div>
        <div className="inf-subtask">
          <h4>{subtask.subtask_name}</h4>
          <div className="content-section">
            <p>{subtask.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}