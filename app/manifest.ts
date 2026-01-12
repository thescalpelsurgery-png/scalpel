import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Scalpel | Master Advanced Surgical Techniques',
        short_name: 'Scalpel',
        description: 'Join a comprehensive academic platform where interdisciplinary collaboration meets continuous professional development.',
        start_url: '/',
        display: 'standalone',
        background_color: '#05221C',
        theme_color: '#0891b2',
        icons: [
            {
                src: '/logo.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}
