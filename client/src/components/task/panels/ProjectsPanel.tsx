import { useEffect, useState } from 'react';
import { uniqBy } from 'lodash';

import { useCompanyTasksContext } from '../CompanyTasksContext';

import { SelectItem } from './StyledPanel';

const ProjectsPanel = () => {
  const { tasks, selectedProjectList, setSelectedProjectList } =
    useCompanyTasksContext();

  const [allProjects, setAllProjects] = useState<any>([]);

  const handleSelect = (checked, value) => {
    if (checked) {
      setSelectedProjectList((prev) => [...prev, value]);
    } else {
      setSelectedProjectList(
        selectedProjectList.filter((item) => item !== value),
      );
    }
  };

  useEffect(() => {
    let taskProjects: any = [];
    taskProjects = tasks.map((t) => {
      return { name: t.project?.name, id: t.project?._id };
    });
    setAllProjects(
      uniqBy(
        taskProjects.map((d: any) => ({
          id: d.id,
          label: d.name,
        })),
        'id',
      ),
    );
  }, [tasks]);

  return (
    <>
      {allProjects.map((project) => (
        <SelectItem key={project.id} className="ttc">
          <label>
            <input
              type="checkbox"
              checked={selectedProjectList.includes(project.id)}
              onChange={(e) => {
                handleSelect((e.target as any).checked, project.id);
              }}
            />{' '}
            {project.label}
          </label>
        </SelectItem>
      ))}
    </>
  );
};

export default ProjectsPanel;
