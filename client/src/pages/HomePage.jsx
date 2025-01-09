import { useEffect, useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { CreateProject } from "../components/modal/CreateProject";
import { fetchProjectsByUser, getUserProfile } from "../api/todolist.api";
import { Sidebar } from "../components/Sidebar";
import { useProjectFilter } from "../hook/useProjectFilter";
import SubTitleLabel from "../components/atoms/SubTitleLabel";
import TitleLabel from "../components/atoms/TitleLabel";
import { LoadingSpinner } from "../components/LoadingSpinner";
import HomePageTemplate from "../components/template/HomePageTemplate";

export function HomePage() {
  return ( 
    <HomePageTemplate />
  )
}
