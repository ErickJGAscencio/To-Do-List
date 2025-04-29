import React, { useState } from "react";

function FilterProjects() {
    const [filterActive, setFilterActive] = useState("to do");

    function handleSelectFilter(option) {
        setFilterActive(option)
    }

    return (
        <div className="filter">
            <div className="filter-options">
                <button
                    onClick={() => handleSelectFilter("to do")}
                    className={filterActive === "to do" ? "blue-button" : "filter-desactive"}
                >
                    To-do
                </button>
                <button
                    onClick={() => handleSelectFilter("in progress")}
                    className={filterActive === "in progress" ? "filter-active" : "filter-desactive"}
                >
                    In Progress
                </button>
                <button
                    onClick={() => handleSelectFilter("finished")}
                    className={filterActive === "finished" ? "filter-active" : "filter-desactive"}
                >
                    Finished
                </button>
            </div>
        </div>
    )
}
export default FilterProjects