import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { BlogCard } from "@/components/cards/BlogCard";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTA } from "@/components/sections/CTA";
import { DetailSkeleton } from "@/components/sections/DetailSkeleton";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPostDate, getPost, posts, readingMinutes } from "@/content/blog";
import { blogPostingSchema, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` });
}

// Params are read inside <Suspense> so the shared App Shell stays URL-independent
// (required for instant navigations with Partial Prefetching). Known slugs are
// still fully prerendered via generateStaticParams.
export default function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton compact />}>
      <BlogPostContent params={params} />
    </Suspense>
  );
}

async function BlogPostContent({ params }: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const pid = `post-${post.slug}`;

  return (
    <>
      <PageHero
        id={`${pid}-hero`}
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        crumbs={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
        compact
      >
        <p className="text-sm text-white/65">
          {post.author}
          <span aria-hidden="true"> · </span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {readingMinutes(post)} min read
        </p>
      </PageHero>

      <article aria-labelledby={`${pid}-hero-title`} className="bg-white pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-site">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] bg-forest-900 md:aspect-[16/8] md:rounded-[2rem]">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>

          <div className="mx-auto mt-14 max-w-3xl md:mt-20">
            {post.body.map((block, index) => (
              <section key={block.heading ?? index} className={index === 0 ? undefined : "mt-12"}>
                {block.heading && (
                  <h2 className="font-display text-2xl font-bold tracking-tight text-ink-950 sm:text-[1.75rem]">{block.heading}</h2>
                )}
                {block.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className={
                      index === 0
                        ? "mt-5 text-xl leading-relaxed text-ink-700 first:mt-0"
                        : "mt-4 text-[1.0625rem] leading-[1.8] text-ink-600"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
                {block.list && (
                  <ul className="mt-5 space-y-3">
                    {block.list.map((item) => (
                      <li key={item} className="flex gap-3 text-[1.0625rem] leading-relaxed text-ink-600">
                        <span aria-hidden="true" className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-leaf-500 text-white">
                          <Check className="size-3" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <p className="mt-14 rounded-2xl border border-mist-200 bg-mist-50 p-5 text-sm leading-relaxed text-ink-500">
              This article offers general information only and should not be taken as legal, safety or compliance advice.
              Always follow the regulations and guidance that apply to your own site and material.
            </p>

            <Link
              href="/blog"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-900"
            >
              <ArrowLeft aria-hidden="true" className="size-4" /> Back to all articles
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby={`${pid}-related`} className="section-y">
          <div className="container-site">
            <Reveal>
              <SectionHeading id={`${pid}-related`} eyebrow="Keep Reading" title="You might also like" />
            </Reveal>
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal as="li" key={item.slug} delay={index * 90}>
                  <BlogCard post={item} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CTA id={`${pid}-cta`} />
      <JsonLd data={blogPostingSchema(post)} />
    </>
  );
}
