import React from "react";
import TitleLabel from "../atoms/TitleLabel";
import CreateTask from "../modal/CreateTask";
import { TaskCard } from "../TaskCard";
import SubTitleLabel from "../atoms/SubTitleLabel";

function ProjectTasks({id_project, addNewTask, tasks, removeTask, completeTask}) {

  return (
    <div className="card-section">
      <div className="menu">
        <TitleLabel label={"Tasks"} />
        <CreateTask
          id_project={id_project}
          addNewTask={addNewTask}
          classStyle={'blue-button'} />
      </div>
      <div className="main-tasks">
        {/* {loading && <LoadingSpinner />} */}
        {tasks.length > 0 ? (tasks.map((task) =>
          (<TaskCard
          key={task.id}
          task={task}
          removeTask={removeTask}
          completeTask={completeTask} />
          ))
        ) : (
          <SubTitleLabel label={'You need make some tasks'} />
        )}
      </div>
    </div>
  )
}

export default ProjectTasks