import {
  CheerioCrawler,
  CheerioCrawlingContext,
  CheerioCrawlerOptions,
} from "crawlee";
import * as cheerio from "cheerio";
import camelcaseKeys from "camelcase-keys";
import { Record, Company, Job, Founder, NewsItem, Launch } from "./schemas";

// Utility type to add Optional if needed
type PartialRecord = Partial<Record>;
type PartialCompany = Partial<Company>;
type PartialJob = Partial<Job>;
type PartialFounder = Partial<Founder>;
type PartialLaunch = Partial<Launch>;
type PartialNewsItem = Partial<NewsItem>;

/**
 * Extracts company data from a partial company object.
 * @param data - Partial company data.
 * @returns Fully constructed Company object.
 */
const extractCompany = (data: PartialCompany): Company => ({
  id: data.id!,
  name: data.name!,
  smallLogoUrl: data.smallLogoUrl,
  batchName: data.batchName,
  oneLiner: data.oneLiner,
  website: data.website,
  longDescription: data.longDescription,
  tags: data.tags,
  yearFounded: data.yearFounded,
  teamSize: data.teamSize,
  location: data.location,
  city: data.city,
  cityTag: data.cityTag,
  country: data.country,
  linkedinUrl: data.linkedinUrl,
  twitterUrl: data.twitterUrl,
  fbUrl: data.fbUrl,
  cbUrl: data.cbUrl,
  githubUrl: data.githubUrl,
  ycdcStatus: data.ycdcStatus,
  freeResponseQuestionAnswers: data.freeResponseQuestionAnswers,
  ddayVideoUrl: data.ddayVideoUrl,
  ddayPresenterId: data.ddayPresenterId,
  appVideoUrl: data.appVideoUrl,
  appAnswers: data.appAnswers,
  ycdcCompanyUrl: data.ycdcCompanyUrl,
  primaryGroupPartner: data.primaryGroupPartner,
  companyPhotos: data.companyPhotos,
});

/**
 * Extracts job postings from an array of partial job objects.
 * @param data - Array of partial job objects.
 * @returns Fully constructed array of Job objects.
 */
const extractJobPostings = (data: PartialJob[]): Job[] =>
  data.map((job) => ({
    id: job.id!,
    title: job.title!,
    url: job.url,
    applyUrl: job.applyUrl,
    location: job.location,
    askUs: job.askUs,
    type: job.type,
    role: job.role,
    roleSpecificType: job.roleSpecificType,
    salaryRange: job.salaryRange,
    equityRange: job.equityRange,
    minExperience: job.minExperience,
    minSchoolYear: job.minSchoolYear,
    isIncomplete: job.isIncomplete!,
    companyUrl: job.companyUrl,
    companyLogoUrl: job.companyLogoUrl,
    companyName: job.companyName,
    companyBatchName: job.companyBatchName,
    companyOneLiner: job.companyOneLiner,
    createdAt: job.createdAt,
    lastActive: job.lastActive,
    hiringManager: job.hiringManager,
  })) as Job[];

/**
 * Extracts founder data from an array of partial founder objects.
 * @param data - Array of partial founder objects.
 * @returns Fully constructed array of Founder objects.
 */
const extractFounders = (data: PartialFounder[]): Founder[] =>
  data.map((founder) => ({
    userId: founder.userId,
    isActive: founder.isActive,
    founderBio: founder.founderBio,
    fullName: founder.fullName,
    title: founder.title,
    avatarThumbUrl: founder.avatarThumbUrl,
    twitterUrl: founder.twitterUrl,
    linkedinUrl: founder.linkedinUrl,
    hasEmail: founder.hasEmail,
    latestYCCompany: founder.latestYcCompany,
  })) as Founder[];

/**
 * Extracts launch posts from an array of partial launch objects.
 * @param data - Array of partial launch objects.
 * @returns Fully constructed array of Launch objects.
 */
const extractLaunchPosts = (data: PartialLaunch[]): Launch[] =>
  data.map((launch) => ({
    id: launch.id!,
    title: launch.title!,
    body: launch.body,
    tagline: launch.tagline,
    createdAt: launch.createdAt!,
    company: {
      id: launch.company!.id!,
      name: launch.company!.name!,
      logo: launch.company!.logo,
      batch: launch.company!.batch,
      tags: launch.company!.tags,
      url: launch.company!.url,
      slug: launch.company!.slug,
      description: launch.company!.description,
    },
    user: {
      name: launch.user!.name!,
      avatar: launch.user!.avatar!,
    },
    totalVoteCount: launch.totalVoteCount,
    slug: launch.slug,
    launchEmbedUrl: launch.launchEmbedUrl,
    twitterShareUrl: launch.twitterShareUrl,
  })) as Launch[];

/**
 * Extracts news items from an array of partial news item objects.
 * @param data - Array of partial news item objects.
 * @returns Fully constructed array of NewsItem objects.
 */
const extractNewsItems = (data: PartialNewsItem[]): NewsItem[] =>
  data.map((news) => ({
    title: news.title,
    url: news.url,
    date: news.date,
  })) as NewsItem[];

/**
 * Extract the company data using Cheerio.
 * @param $ - The CheerioAPI instance.
 * @returns An object containing extracted company data.
 */
const extractRecord = ($: cheerio.CheerioAPI): PartialRecord => {
  const rawData = $("div[data-page]");
  const attribs = rawData.attr();

  if (!attribs || !attribs["data-page"]) {
    console.error("Data-page attribute is missing or undefined.");
    return {};
  }

  const dataPage = attribs["data-page"];
  const dataPageObj = JSON.parse(dataPage);

  if (!dataPageObj || !dataPageObj.props || !dataPageObj.props.company) {
    return {};
  }

  const companyInfo = camelcaseKeys(dataPageObj.props.company);
  const jobs = extractJobPostings(dataPageObj.props.jobPostings || []);
  const jobUrl = dataPageObj.props.jobsUrl || "";
  const launchPosts = extractLaunchPosts(
    camelcaseKeys(dataPageObj.props.launches) || []
  );
  const newsItems = extractNewsItems(dataPageObj.props.newsItems || []);
  const newsUrl = dataPageObj.props.newsUrl || "";
  const founders = extractFounders(
    camelcaseKeys(dataPageObj.props.company.founders) || []
  );

  const record = {
    company: extractCompany(companyInfo),
    jobPostings: jobs,
    jobsUrl: jobUrl,
    newsItems: newsItems,
    newsUrl: newsUrl,
    founders: founders,
    launches: launchPosts,
  };
  console.log("Record:");

  return record;
};

/**
 * Scrape the company page and extract data.
 * @param company - An object containing company name and URL.
 * @returns A Promise resolving to a Record object.
 */
export const scrapeCompany = async (company: {
  name: string;
  url: string;
}): Promise<Record> => {
  const extractedData: PartialRecord = {};

  const crawlerOptions: CheerioCrawlerOptions = {
    async requestHandler(ctx: CheerioCrawlingContext) {
      const { $ } = ctx;
      Object.assign(extractedData, extractRecord($));
    },
    failedRequestHandler: async ({ request }) => {
      console.error(`Request for ${request.url} failed.`);
    },
  };

  const crawler = new CheerioCrawler(crawlerOptions);
  await crawler.run([company.url]);
  return extractedData as Record;
};
