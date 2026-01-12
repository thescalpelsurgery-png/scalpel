import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, User, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { ShareSection } from "@/components/blog/share-section"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase.from("blogs").select("title, excerpt, image_url").eq("slug", slug).single()

  if (!post) return { title: "Blog Post Not Found" }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [post.image_url] : [],
      type: "article",
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!post) {
    notFound()
  }


  // Fetch related posts (same category, excluding current, limiting to 2)
  const { data: relatedPosts } = await supabase
    .from("blogs")
    .select("slug, title, image_url, published_at, category, read_time")
    .eq("is_published", true)
    .eq("category", post.category)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(2)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image_url,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Scalpel",
      logo: {
        "@type": "ImageObject",
        url: "https://scalpel.org/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://scalpel.org/blog/${post.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <article className="pt-20 pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 min-h-screen relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-40 -left-64 w-96 h-96 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-96 -right-64 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back Link */}
        <div className="container mx-auto px-4 py-6 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-600 hover:text-primary transition-all duration-300 hover:gap-3 gap-2 group bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200/50"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
        </div>

        {/* Hero Image with Enhanced Gradient Overlay */}
        <div className="container mx-auto px-4 mb-12 relative z-10">
          <div className="relative rounded-none overflow-hidden shadow-2xl group">
            {/* Multi-layer gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 z-10 mix-blend-overlay" />

            <Image
              src={post.image_url || "/placeholder.svg"}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-72 md:h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Category Badge on Image */}
            {post.category && (
              <div className="absolute top-6 left-6 z-20">
                <Badge className="bg-white/90 backdrop-blur-md text-primary px-4 py-2 text-sm font-bold shadow-lg border-0 hover:bg-white">
                  {post.category}
                </Badge>
              </div>
            )}

            {/* Title overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 text-balance leading-[1.1] tracking-tight drop-shadow-lg max-w-4xl">
                {post.title}
              </h1>

              {/* Meta Info in hero */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-2 text-sm text-white/90 font-medium bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {post.read_time && (
                  <span className="flex items-center gap-2 text-sm text-white/90 font-medium bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4" />
                    {post.read_time}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 max-w-6xl mx-auto">
            {/* Main Content */}
            <div>
              {/* Excerpt with Styled Quote */}
              {post.excerpt && (
                <div className="relative mb-10">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-purple-500 to-pink-500 rounded-full" />
                  <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light italic pl-6">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Author Section with Premium Design */}
              {post.author && (
                <div className="relative overflow-hidden rounded-2xl mb-12 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-xl">
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_theme(colors.primary),_transparent_50%)]" />
                  </div>

                  <div className="relative flex items-center gap-5">
                    {post.author_image ? (
                      <Image
                        src={post.author_image}
                        alt={post.author}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/50 shadow-xl"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center ring-4 ring-primary/30 shadow-xl">
                        <User className="w-10 h-10 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
                        Written by
                      </div>
                      <div className="font-bold text-white text-xl">
                        {post.author}
                      </div>
                      {post.author_role && (
                        <div className="text-sm text-slate-400 font-medium">{post.author_role}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Content with Enhanced Prose Styling */}
              <div
                className="prose prose-lg prose-slate max-w-none mb-16
                  prose-headings:font-extrabold prose-headings:text-slate-900 prose-headings:tracking-tight prose-headings:scroll-mt-24
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-200
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                  prose-a:text-primary prose-a:no-underline prose-a:font-semibold prose-a:border-b-2 prose-a:border-primary/30 hover:prose-a:border-primary hover:prose-a:bg-primary/5 prose-a:transition-all
                  prose-strong:text-slate-900 prose-strong:font-bold
                  prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-li:text-slate-700 prose-li:my-2 prose-li:text-lg
                  prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-slate-700
                  prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-10 prose-img:ring-1 prose-img:ring-slate-200
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary/5 prose-blockquote:to-transparent
                  prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-slate-800 prose-blockquote:text-xl
                  prose-code:text-primary prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-semibold
                  prose-pre:bg-slate-900 prose-pre:rounded-2xl prose-pre:shadow-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <ShareSection title={post.title} slug={post.slug} />

              {/* Related Posts with Enhanced Design */}
              {relatedPosts && relatedPosts.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-primary" />
                      Related Articles
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/${relatedPost.slug}`}
                        className="group block bg-white rounded-none overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Image
                            src={relatedPost.image_url || "/placeholder.svg"}
                            alt={relatedPost.title}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {relatedPost.category && (
                            <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white border-0 z-20">
                              {relatedPost.category}
                            </Badge>
                          )}
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 text-lg mb-3">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(relatedPost.published_at).toLocaleDateString()}
                            </span>
                            {relatedPost.read_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {relatedPost.read_time}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block space-y-6">
              {/* Table of Contents */}
              <TableOfContents content={post.content} />
            </aside>
          </div>
        </div>
      </article>
    </>
  )
}
