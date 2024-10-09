import "../components/SubTaskCard.css"
import { FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { EditSubTask } from "./modal/EditSubTask";
import { useEffect, useState } from "react";
import { deleteSubTask, updateSubtask } from "../api/todolist.api";
import Delete from "./modal/Delete";

export function SubTaskCard({ subtask, removeSubTask, setSubTaskFront }) {
  const [isCompleted, setIsCompleted] = useState();

  useEffect(() => {
    setIsCompleted(subtask.is_completed);
  }, [subtask])

  const deleteMethod = async () => {
    try {
      const token = localStorage.getItem("token");
      const id_subtask = subtask.id;
      const response = await deleteSubTask(id_subtask, token);
      if (response != null) {
        removeSubTask(id_subtask)
      }
    } catch (error) {
      console.error(error);
    }
  }

  const checkBtn = async () => {
    try {
      const newCompletedStatus = !isCompleted;
      setIsCompleted(newCompletedStatus);

      const token = localStorage.getItem("token");
      const idSubTask = subtask.id;
      const updatedData = {
        is_completed: newCompletedStatus
      };
  
      const res = await updateSubtask(idSubTask, updatedData, token);
      setSubTaskFront(res);
    } catch (error) {
      console.error('Error updating subtasks status:', error);
    }
  };
  

  return (
    <div>
      <div className="subtask-card">
        <div className="action-btn">
          <button onClick={checkBtn}>
            {isCompleted ? (
              <FaCheckCircle style={{ color: 'yellow' }} />
            ) : (
              <FaRegCircle style={{ color: 'black' }} />
            )}
          </button>
          <button><EditSubTask subtask={subtask} /></button>
          <Delete name={ "subtask " + subtask.subtask_name } deleteMethod={deleteMethod} />
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
