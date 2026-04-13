import type { ResumeModel } from "./resumeTypes";

export function genId(): string {
  return crypto.randomUUID();
}

export function emptyResume(): ResumeModel {
  return {
    profile: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: ""
    },
    summary: "",
    experience: [],
    education: [],
    skillGroups: [
      { id: genId(), label: "Core", skills: "" },
      { id: genId(), label: "Tools & platforms", skills: "" }
    ],
    projects: [],
    languages: "",
    certifications: ""
  };
}

export function demoResume(): ResumeModel {
  return {
    profile: {
      fullName: "Aanya Sharma",
      headline: "Product Designer · Design Systems",
      email: "aanya.sharma@email.com",
      phone: "+91 98765 43210",
      location: "Bengaluru, India",
      website: "aanyasharma.design",
      linkedin: "linkedin.com/in/aanyasharma",
      github: "github.com/aanyasharma"
    },
    summary:
      "Designer focused on clarity, accessibility, and measurable outcomes. Led component libraries used by 40+ engineers, shipped onboarding flows that improved activation, and partnered with PMs on discovery through delivery.",
    experience: [
      {
        id: genId(),
        company: "Northwind Labs",
        title: "Senior Product Designer",
        location: "Remote · India",
        start: "2023",
        end: "",
        current: true,
        bullets: [
          "Owned the design system roadmap; cut inconsistent UI debt by consolidating 120+ components.",
          "Partnered with engineering on token pipeline + Storybook adoption for faster reviews.",
          "Ran weekly design critiques and mentored two mid-level designers on research craft."
        ]
      },
      {
        id: genId(),
        company: "Brightline Health",
        title: "Product Designer",
        location: "Bengaluru",
        start: "2020",
        end: "2023",
        current: false,
        bullets: [
          "Redesigned member dashboard; reduced support tickets related to billing visibility by 18% QoQ.",
          "Built Figma → handoff templates that shortened dev cycle time on mobile releases.",
          "Facilitated workshops with clinical stakeholders to align on safe, legible data presentation."
        ]
      }
    ],
    education: [
      {
        id: genId(),
        school: "National Institute of Design",
        degree: "M.Des",
        field: "Interaction Design",
        start: "2018",
        end: "2020",
        details: "Graduate studio: systems thinking, prototyping, and ethnographic research."
      },
      {
        id: genId(),
        school: "University of Mumbai",
        degree: "B.Sc",
        field: "Computer Science",
        start: "2015",
        end: "2018",
        details: "Coursework in HCI, statistics, and visual communication."
      }
    ],
    skillGroups: [
      {
        id: genId(),
        label: "Design",
        skills: "Figma, prototyping, design systems, accessibility (WCAG), workshop facilitation"
      },
      {
        id: genId(),
        label: "Research & delivery",
        skills: "Usability testing, journey mapping, A/B readouts, PRD collaboration, design QA"
      }
    ],
    projects: [
      {
        id: genId(),
        name: "Atlas DS",
        url: "atlas-ds.example.com",
        description: "Open-style token kit + documentation used by three product squads.",
        tech: "Figma, Tokens Studio, React"
      }
    ],
    languages: "English (professional), Hindi (native)",
    certifications: "Google UX Design Certificate (2021)"
  };
}
