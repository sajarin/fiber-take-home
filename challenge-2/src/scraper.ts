import { CheerioCrawler, CheerioCrawlingContext, CheerioCrawlerOptions } from 'crawlee';
import * as cheerio from 'cheerio';
import { CompanyData, LaunchPost, Job, Founder, NewsItem } from './schemas';

// Utility type to add Optional if needed
type PartialCompanyData = Partial<CompanyData>;

// Helper function to extract job postings
const extractJobPostings = (data: any[]): Job[] => data.map((job: any) => ({
    id: job.id,
    title: job.title,
    url: job.url,
    applyUrl: job.apply_url,
    location: job.location,
    askUs: job.ask_us,
    type: job.type,
    role: job.role,
    roleSpecificType: job.role_specific_type,
    salaryRange: job.salary_range,
    equityRange: job.equity_range,
    minExperience: job.min_experience,
    minSchoolYear: job.min_school_year,
    isIncomplete: job.is_incomplete,
    companyUrl: job.company_url,
    companyLogoUrl: job.company_logo_url,
    companyName: job.company_name,
    companyBatchName: job.company_batch_name,
    companyOneLiner: job.company_one_liner,
    createdAt: job.created_at,
    lastActive: job.last_active,
    hiringManager: job.hiring_manager
})) as Job[];

// Helper function to extract founders
const extractFounders = (data: any[]): Founder[] => data.map((founder: any) => ({
    name: founder.name,
    linkedIn: founder.linkedIn,
    avatar: founder.avatar
})) as Founder[];

// Helper function to extract launch posts
const extractLaunchPosts = (data: any[]): LaunchPost[] => data.map((launch: any) => ({
    id: launch.id,
    title: launch.title,
    body: launch.body,
    bodyMd: launch.body_md,
    tagline: launch.tagline,
    createdAt: launch.created_at,
    company: {
        id: launch.company.id,
        name: launch.company.name,
        logo: launch.company.logo,
        batch: launch.company.batch,
        tags: launch.company.tags,
        url: launch.company.url,
        slug: launch.company.slug,
        description: launch.company.description
    },
    user: {
        name: launch.user.name,
        avatar: launch.user.avatar
    },
    totalVoteCount: launch.total_vote_count,
    slug: launch.slug,
    launchEmbedUrl: launch.launch_embed_url,
    twitterShareUrl: launch.twitter_share_url
})) as LaunchPost[];

// Helper function to extract news items
const extractNewsItems = (data: any[]): NewsItem[] => data.map((news: any) => ({
    title: news.title,
    url: news.url,
    date: news.date
})) as NewsItem[];

/**
 * Extract the company data using Cheerio.
 * @param $ - The CheerioAPI instance
 * @returns - An object containing extracted company data
 */
const extractCompanyData = ($: cheerio.CheerioAPI): PartialCompanyData => {
    const rawData = $('div[data-page]');  // Select the div with the data-page attribute
    const attribs = rawData.attr();  // Get the attributes of the selected element

    // If attribs is undefined, return an empty object
    if (!attribs || !attribs['data-page']) {
        console.error('Data-page attribute is missing or undefined.');
        return {}; 
    }

    // Print the attribs object for manual inspection
    console.log('Attributes:', attribs);

    const dataPage = attribs['data-page'];  // Get the value of the data-page attribute
    const dataPageObj = JSON.parse(dataPage);  // Parse the JSON string into an object if dataPage is defined

    if (!dataPageObj || !dataPageObj.props || !dataPageObj.props.company) {
        return {};  // Return empty object if dataPageObj or required properties are missing
    }

    const companyInfo = dataPageObj.props.company;

    return {
        name: companyInfo.name,
        founded: companyInfo.year_founded ? companyInfo.year_founded.toString() : undefined,
        teamSize: companyInfo.team_size,
        jobs: extractJobPostings(dataPageObj.props.jobPostings),
        founders: extractFounders(companyInfo.founders),
        launchPosts: extractLaunchPosts(dataPageObj.props.launches),
        jobPostings: extractJobPostings(dataPageObj.props.jobPostings),
        newsItems: extractNewsItems(dataPageObj.props.newsItems),
        jobsUrl: dataPageObj.props.jobsUrl,
        newsUrl: dataPageObj.props.newsUrl,
        launches: extractLaunchPosts(dataPageObj.props.launches),
    };
};

/**
 * Scrape the company page and extract data.
 * @param company - An object containing company name and URL
 * @returns - A Promise resolving to a CompanyData object
 */
export const scrapeCompany = async (company: { name: string; url: string }): Promise<CompanyData> => {
    const extractedData: PartialCompanyData = {};

    const crawlerOptions: CheerioCrawlerOptions = {
        async requestHandler(ctx: CheerioCrawlingContext) {
            const { $ } = ctx;

            // Print out the HTML content for debugging
            // console.log(`HTML content for ${company.name}:`, $.html());

            Object.assign(extractedData, extractCompanyData($));
        },
        // Handle failed or dropped requests
        failedRequestHandler: async ({ request }) => {
            console.error(`Request for ${request.url} failed.`);
        },
    };

    const crawler = new CheerioCrawler(crawlerOptions);
    await crawler.run([company.url]);
    return extractedData as CompanyData;
};