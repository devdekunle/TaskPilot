import { createSelector } from "@reduxjs/toolkit";

export const selectAllTasks = createSelector(
  (state) => state.projects,
  (state) => state.tasks.tasks,
  (projects, tasks) => {
    const allTasks = [];
    projects.projects.forEach((project) => {
      allTasks.push(...tasks.filter((task) => task.projectId === project.id));
    });
    return allTasks;
  }
);
