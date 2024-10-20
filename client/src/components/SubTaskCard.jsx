// import "../components/SubTaskCard.css"
import { FaCheckCircle, FaEllipsisH, FaRegCircle } from 'react-icons/fa';
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
      <div className="card">
        <div className="header-card">
          <div className='title-card'>{subtask.subtask_name}</div>
          <div className="button-menu" onClick={checkBtn}>
            {isCompleted ? (
              <FaCheckCircle style={{ color: '#0884c4' }} />
            ) : (
              <FaRegCircle style={{ color: '#0884c4' }} />
            )}
          </div>
        </div>
        <div className='content-section'>
          <div className="card-description">
            {subtask.description}
          </div>
          <div className="action-botones">
            <div className="button-menu">
            <EditSubTask subtask={subtask} setSubTaskFront={setSubTaskFront} />
            </div>
            <div className="button-menu">
            <Delete name={"subtask " + subtask.subtask_name} deleteMethod={deleteMethod} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
