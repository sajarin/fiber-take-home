export interface CompanyData {
  company?: Company;
  jobPostings?: Job[];
  jobsUrl?: string;
  newsItems?: NewsItem[];
  newsUrl?: string;
  founders?: Founder[];
  launches?: Launch[];
}

export interface Company {
  id: number;
  name: string;
  logo?: string;
  batch?: string;
  logoUrl?: string;
  oneLiner?: string;
  website?: string;
  longDescription?: string;
  tags?: string[];
  isActive?: boolean;
  yearFounded?: number;
  teamSize?: number;
  location?: string;
  city?: string;
  cityTag?: string;
  country?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  crunchbaseUrl?: string;
  gitubUrl?: string;
  ycdcStatus?: string;
  freeResponseQuestionAnswers?: FreeResponseQuestionAnswer[];
  ddayVideoUrl?: string | null;
  ddayPresenterId?: number;
  appVideoUrl?: string | null;
  appAnswers?: any[];
  ycdcCompanyUrl?: string;
  primaryGroupPartner?: GroupPartner;
  founders?: Founder[];
  companyPhotos?: any[];
}

export interface FreeResponseQuestionAnswer {
  id?: string;
  question?: string;
  answer?: string;
}

export interface GroupPartner {
  id?: number;
  fullName?: string;
  url?: string;
}

export interface Founder {
  userId?: number;
  isActive?: boolean;
  founderBio?: string;
  fullName?: string;
  title?: string;
  avatarThumbUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  hasEmail?: boolean;
  latestYCCompany?: LatestYCCompany;
}

export interface LatestYCCompany {
  name?: string;
  href?: string;
}

export interface Job {
  id: number;
  title: string;
  url?: string;
  applyUrl?: string;
  location?: string;
  askUs?: boolean;
  type?: string;
  role?: string;
  roleSpecificType?: string;
  salaryRange?: string;
  equityRange?: string;
  minExperience?: string;
  minSchoolYear?: string;
  isIncomplete: boolean;
  companyUrl?: string;
  companyLogoUrl?: string;
  companyName?: string;
  companyBatchName?: string;
  companyOneLiner?: string;
  createdAt?: string;
  lastActive?: string | null;
  hiringManager?: HiringManager;
}

export interface HiringManager {
  id: number;
  first_name?: string;
  last_name?: string;
  avatar_thumb?: string;
}
export interface NewsItem {
  title?: string;
  url?: string;
  date?: string;
}

export interface Launch {
  id: number;
  title: string;
  body?: string;
  tagline?: string;
  createdAt: string;
  company?: LaunchCompany;
  user?: User;
  totalVoteCount?: number;
  slug?: string;
  launchEmbedUrl?: string;
  twitterShareUrl?: string;
  sanitizedTitle?: string;
  url?: string;
}

export interface LaunchCompany {
  id: number;
  name: string;
  logo?: string;
  batch?: string;
  tags?: string[];
  url?: string;
  slug?: string;
  description?: string;
}

export interface User {
  name: string;
  avatar: string;
}
