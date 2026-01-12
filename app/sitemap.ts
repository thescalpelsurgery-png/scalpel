import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://scalpelsurgery.org'

    // Define static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        '',
        '/about',
        '/events',
        '/blog',
        //'/become-member',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    const supabase = await createClient()

    // Fetch all published blogs
    const { data: blogs } = await supabase
        .from('blogs')
        .select('slug, updated_at, created_at')
        .eq('is_published', true)

    const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at || blog.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    // Fetch all events
    const { data: events } = await supabase
        .from('events')
        .select('id, updated_at, created_at')

    const eventRoutes: MetadataRoute.Sitemap = (events || []).map((event) => ({
        url: `${baseUrl}/events/${event.id}`,
        lastModified: new Date(event.updated_at || event.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...staticRoutes, ...blogRoutes, ...eventRoutes]
}
