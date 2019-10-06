const env = process.env.NODE_ENV === 'development';

export const baseURL = env ? 'http://localhost:9000/api/v1' : '/api/v1/';

export const COOKIE_PROFILE = 'org.liberiot.liberiotred_cookie_profile';
export const COOKIE_TOKEN = 'org.liberiot.liberiotred_token';

export const slideSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
        {
            breakpoint: 1378,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                initialSlide: 0,
                infinite: false,
                dots: true
            }
        },
        {
            breakpoint: 1125,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 0
            }
        },
        {
            breakpoint: 870,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 0
            }
        }
    ]
};

export type IDetailCardsData = {
    title: string,
    route: string,
    description: string,
    icon: string,
    color: string,
    project: boolean,
    organization: boolean
}
export const DetailCardsData: Array<IDetailCardsData> = [
    {
        title: 'Devices',
        route: '/devices',
        description: 'List of devices',
        icon: 'mobile',
        color: '#28b1cc',
        project: true,
        organization: true
    },
    {
        title: 'Gateways',
        route: '/gateways',
        description: 'List of gateways',
        icon: 'wifi',
        color: '#1b6ac9',
        project: true,
        organization: true
    },
    {
        title: 'API Keys',
        route: '/api',
        description: 'See the api options',
        icon: 'api',
        color: '#ff2d55',
        project: false,
        organization: true
    },
    {
        title: 'Shadow Devices',
        route: '/shadow-devices',
        description: 'List of your shadow devices',
        icon: 'experiment',
        color: '#ff2d55',
        project: true,
        organization: false
    },
    {
        title: 'Users',
        route: '/users',
        description: 'List of your users',
        icon: 'user',
        color: '#5856d6',
        project: true,
        organization: true
    },
    {
        title: 'Documentation',
        route: '/documentation',
        description: 'Api documentation',
        icon: 'book',
        color: '#009900',
        project: true,
        organization: true
    }
]

export const exampleTransmission = {
    value: 21,
    gateway: 'EEEEFFFFGGGGHHHH',
    device: 'AAAABBBBCCCCDDDD',
    endpoint: 'temperature',
    organization: 'aaaa-bbbb-cccc-9999-eeee',
    created_at: new Date().toISOString()
}