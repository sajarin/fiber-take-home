export interface Job {
    id: number;
    title: string;
    url: string | undefined;
    applyUrl: string | undefined;
    location: string;
    askUs: boolean;
    type: string;
    role: string;
    roleSpecificType: string;
    salaryRange: string;
    equityRange: string;
    minExperience: string;
    minSchoolYear: string;
    isIncomplete: boolean;
    companyUrl: string;
    companyLogoUrl: string;
    companyName: string;
    companyBatchName: string;
    companyOneLiner: string;
    createdAt: string;
    lastActive?: string | null;
    hiringManager: HiringManager;
}

export interface HiringManager {
    id: number;
    firstName: string;
    lastName: string;
    avatarThumb: string;
    avatarMedium: string;
    [key: string]: any;
}

export interface Founder {
    name: string;
    linkedIn: string;
    avatar?: string;
    [key: string]: any;
}

export interface LaunchPost {
    id: number;
    title: string;
    body: string;
    bodyMd: string;
    tagline: string;
    createdAt: string;
    company: Company;
    user: User;
    totalVoteCount: number;
    slug: string;
    launchEmbedUrl: string;
    twitterShareUrl: string;
}

export interface User {
    name: string;
    avatar: string;
}

export interface Company {
    id: number;
    name: string;
    logo: string;
    batch: string;
    tags: string[];
    url: string;
    slug: string;
    description: string;
}

export interface NewsItem {
    title: string;
    url: string;
    date: string;
}

export interface CompanyData {
    name: string;
    founded?: string;
    teamSize?: number;
    jobs?: Job[];
    founders?: Founder[];
    launchPosts?: LaunchPost[];
    jobPostings?: Job[];
    latestYcCompany?: LatestYcCompany;
    newsItems?: NewsItem[];
    jobsUrl?: string;
    newsUrl?: string;
    launches?: LaunchPost[];
}

export interface LatestYcCompany {
    name: string;
    href: string;
}