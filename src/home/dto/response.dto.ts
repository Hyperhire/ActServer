export class HomePageDto {
    banners: Array<Banner>
    orgs: Array<Organization>
    campaigns: Array<Campaign>
    notices: Array<Notice>
    faqs: Array<FAQ>
    static: Static
}

export interface Banner {
    imageUrl: string
    navigation: Navigation
}

export interface Campaign {
    title: string
    short_Descriptions: string
    target: string
    campaignImage: string,
    _id: string
}
export interface Organization {
    _id: string
    icon: string
    name: string
    images: Array<string>
}

export interface Navigation {
    navigationType: string
    action: string,
}

export interface Notice {
    title: string
    description: string
    issued_at: Date
}

export interface FAQ {
    question: string
    answer: string
}

export interface Static {
    content: string
}