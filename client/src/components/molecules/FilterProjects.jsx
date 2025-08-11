import React, { useState } from "react";

function FilterProjects({setFilter}) {
    const [filterActive, setFilterActive] = useState("all");

    function handleSelectFilter(option) {
        setFilterActive(option)
    }

    return (
        <div className="filter">
            <div className="filter-options">
                <button
                    onClick={() => {handleSelectFilter("all"), setFilter("all")}}
                    className={filterActive === "all" ? "blue-button" : "filter-desactive"}
                >
                    All
                </button>
                <button
                    onClick={() => {handleSelectFilter("in progress"), setFilter("inProgress")}}
                    className={filterActive === "in progress" ? "blue-button" : "filter-desactive"}
                >
                    In Progress
                </button>
                <button
                    onClick={() => {handleSelectFilter("completed"), setFilter("completed")}}
                    className={filterActive === "completed" ? "blue-button" : "filter-desactive"}
                >
                    Finished
                </button>
            </div>
        </div>
    )
}
export default FilterProjects