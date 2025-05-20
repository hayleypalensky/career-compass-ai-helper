
import { Profile } from "@/types/profile";

// Default profile state
export const defaultProfile: Profile = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    website: "",
  },
  experiences: [],
  skills: [],
  education: [],
};
