import "../components/SubTaskCard.css"
import { FaTrash, FaCheckCircle } from 'react-icons/fa';
import { deleteSubTask, updateSubtask } from "../Api/todolist.api";
import { EditSubTask } from "./modal/EditSubTask";
import { useEffect, useState } from "react";

export function SubTaskCard({ subtask, removeSubTask}) {
  const [isCompleted, setIsCompleted] = useState();

  useEffect(() => {
    setIsCompleted(subtask.is_completed);
  }, [subtask])

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

  const checkBtn = async () => {
    try {
      const newCompletedStatus = !isCompleted;
      setIsCompleted(newCompletedStatus);

      const idSubTask = subtask.id;
      const updatedData = {
        is_completed: newCompletedStatus
      };

      const res = await updateSubtask(idSubTask, updatedData);
      // console.log(subtask);
      // console.log("---");
      // console.log(res);
      subtask = res;
    } catch (error) {
      console.error('Error updating subtasks status:', error);
    }
  }

  return (
    <div>
      <div className="subtask-card">
        <div className="action-btn">
          <button>
            <FaCheckCircle 
              onClick={checkBtn} 
              style={{ color: isCompleted ? 'yellow' : 'black' }}
            />
          </button>
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
