import { BlogCard } from "@/components/cards/BlogCard";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { posts } from "@/content/blog";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog — Battery Recycling Insights",
  description:
    "Guides and insights on lithium-ion battery scrap, safe storage, battery chemistries and responsible recycling from UNNATI GREEN ENERGY.",
  path: "/blog",
});

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        id="blog-hero"
        eyebrow="Blog"
        title="Insights on Batteries, Safety & Sustainability"
        description="Practical guidance and perspectives on lithium-ion battery scrap, responsible recovery and the circular energy economy."
        image={photos.leafDark}
        crumbs={[{ label: "Blog", href: "/blog" }]}
        compact
      />

      <section aria-labelledby="blog-latest-title" className="section-y bg-white">
        <div className="container-site">
          <Reveal>
            <SectionHeading id="blog-latest-title" eyebrow="Latest" title="Latest articles" />
          </Reveal>
          {featured && (
            <Reveal className="mt-12">
              <BlogCard post={featured} featured />
            </Reveal>
          )}
          {rest.length > 0 && (
            <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => (
                <Reveal as="li" key={post.slug} delay={(index % 3) * 90}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>

    </>
  );
}
