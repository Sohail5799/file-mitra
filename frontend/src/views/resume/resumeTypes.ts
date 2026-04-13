export type Profile = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  bullets: string[];
};

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  details: string;
};

export type SkillGroup = {
  id: string;
  label: string;
  skills: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  url: string;
  description: string;
  tech: string;
};

export type ResumeModel = {
  profile: Profile;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skillGroups: SkillGroup[];
  projects: ProjectItem[];
  languages: string;
  certifications: string;
};
