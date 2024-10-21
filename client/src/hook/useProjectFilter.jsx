import { useState, useEffect } from 'react';

export function useProjectFilter(projects) {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const setFilter = (filter) => {
    if (filter === "all") {
      setFilteredProjects(projects);
    } else if (filter === "completed") {
      setFilteredProjects(projects.filter(project => project.is_completed === true));
    } else if (filter === "inProgress") {
      setFilteredProjects(projects.filter(project => project.is_completed === false));
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    const term = searchTerm.trim().toLowerCase();
    if (term === '') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(
        project => project.project_name.toLowerCase().includes(term)
      ));
    }
  };

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  return {
    filteredProjects,
    searchTerm,
    setFilter,
    handleSearch,
  };
}
