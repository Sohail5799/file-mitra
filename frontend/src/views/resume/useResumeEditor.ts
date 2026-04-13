import { useCallback, useReducer } from "react";
import type {
  EducationItem,
  ExperienceItem,
  Profile,
  ProjectItem,
  ResumeModel,
  SkillGroup
} from "./resumeTypes";
import { demoResume, emptyResume, genId } from "./resumeDefaults";

export type Action =
  | { type: "LOAD"; payload: ResumeModel }
  | { type: "RESET_EMPTY" }
  | { type: "RESET_DEMO" }
  | { type: "SET_PROFILE"; field: keyof Profile; value: string }
  | { type: "SET_SUMMARY"; value: string }
  | { type: "ADD_EXPERIENCE" }
  | { type: "REMOVE_EXPERIENCE"; id: string }
  | {
      type: "SET_EXPERIENCE";
      id: string;
      field: keyof Omit<ExperienceItem, "id" | "bullets">;
      value: string | boolean;
    }
  | { type: "ADD_BULLET"; expId: string }
  | { type: "SET_BULLET"; expId: string; index: number; value: string }
  | { type: "REMOVE_BULLET"; expId: string; index: number }
  | { type: "ADD_EDUCATION" }
  | { type: "REMOVE_EDUCATION"; id: string }
  | { type: "SET_EDUCATION"; id: string; field: keyof Omit<EducationItem, "id">; value: string }
  | { type: "ADD_SKILL_GROUP" }
  | { type: "REMOVE_SKILL_GROUP"; id: string }
  | { type: "SET_SKILL_GROUP"; id: string; field: keyof Omit<SkillGroup, "id">; value: string }
  | { type: "ADD_PROJECT" }
  | { type: "REMOVE_PROJECT"; id: string }
  | { type: "SET_PROJECT"; id: string; field: keyof Omit<ProjectItem, "id">; value: string }
  | { type: "SET_LANGUAGES"; value: string }
  | { type: "SET_CERTIFICATIONS"; value: string };

function reducer(state: ResumeModel, action: Action): ResumeModel {
  switch (action.type) {
    case "LOAD":
      return action.payload;
    case "RESET_EMPTY":
      return emptyResume();
    case "RESET_DEMO":
      return demoResume();
    case "SET_PROFILE":
      return {
        ...state,
        profile: { ...state.profile, [action.field]: action.value }
      };
    case "SET_SUMMARY":
      return { ...state, summary: action.value };
    case "ADD_EXPERIENCE":
      return {
        ...state,
        experience: [
          ...state.experience,
          {
            id: genId(),
            company: "",
            title: "",
            location: "",
            start: "",
            end: "",
            current: false,
            bullets: [""]
          }
        ]
      };
    case "REMOVE_EXPERIENCE":
      return { ...state, experience: state.experience.filter((e) => e.id !== action.id) };
    case "SET_EXPERIENCE":
      return {
        ...state,
        experience: state.experience.map((e) =>
          e.id === action.id ? { ...e, [action.field]: action.value } : e
        )
      };
    case "ADD_BULLET":
      return {
        ...state,
        experience: state.experience.map((e) =>
          e.id === action.expId ? { ...e, bullets: [...e.bullets, ""] } : e
        )
      };
    case "SET_BULLET":
      return {
        ...state,
        experience: state.experience.map((e) => {
          if (e.id !== action.expId) return e;
          const bullets = [...e.bullets];
          bullets[action.index] = action.value;
          return { ...e, bullets };
        })
      };
    case "REMOVE_BULLET":
      return {
        ...state,
        experience: state.experience.map((e) => {
          if (e.id !== action.expId) return e;
          const bullets = e.bullets.filter((_, i) => i !== action.index);
          return { ...e, bullets: bullets.length ? bullets : [""] };
        })
      };
    case "ADD_EDUCATION":
      return {
        ...state,
        education: [
          ...state.education,
          {
            id: genId(),
            school: "",
            degree: "",
            field: "",
            start: "",
            end: "",
            details: ""
          }
        ]
      };
    case "REMOVE_EDUCATION":
      return { ...state, education: state.education.filter((x) => x.id !== action.id) };
    case "SET_EDUCATION":
      return {
        ...state,
        education: state.education.map((x) =>
          x.id === action.id ? { ...x, [action.field]: action.value } : x
        )
      };
    case "ADD_SKILL_GROUP":
      return {
        ...state,
        skillGroups: [...state.skillGroups, { id: genId(), label: "Skills", skills: "" }]
      };
    case "REMOVE_SKILL_GROUP":
      return {
        ...state,
        skillGroups:
          state.skillGroups.length <= 1
            ? state.skillGroups
            : state.skillGroups.filter((g) => g.id !== action.id)
      };
    case "SET_SKILL_GROUP":
      return {
        ...state,
        skillGroups: state.skillGroups.map((g) =>
          g.id === action.id ? { ...g, [action.field]: action.value } : g
        )
      };
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [
          ...state.projects,
          { id: genId(), name: "", url: "", description: "", tech: "" }
        ]
      };
    case "REMOVE_PROJECT":
      return { ...state, projects: state.projects.filter((p) => p.id !== action.id) };
    case "SET_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, [action.field]: action.value } : p
        )
      };
    case "SET_LANGUAGES":
      return { ...state, languages: action.value };
    case "SET_CERTIFICATIONS":
      return { ...state, certifications: action.value };
    default:
      return state;
  }
}

export function useResumeEditor(initial: ResumeModel = demoResume()) {
  const [model, dispatch] = useReducer(reducer, initial);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(model, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(model.profile.fullName || "resume").replace(/\s+/g, "-")}-file-mitra.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [model]);

  const importJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as ResumeModel;
        if (data && data.profile && Array.isArray(data.experience)) {
          dispatch({ type: "LOAD", payload: data });
        }
      } catch {
        /* ignore */
      }
    };
    reader.readAsText(file);
  }, []);

  return { model, dispatch, exportJson, importJson };
}
