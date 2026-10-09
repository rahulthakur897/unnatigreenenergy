import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPostDate, readingMinutes, type BlogPost } from "@/content/blog";
import { cn } from "@/lib/utils";

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-mist-200 bg-white transition-[box-shadow,border-color,transform] duration-500 ease-premium hover:-translate-y-1 hover:border-leaf-300/60 hover:shadow-lift",
        featured && "lg:grid lg:grid-cols-2",
      )}
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-forest-900", featured && "lg:aspect-auto lg:min-h-[24rem]")}>
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          sizes={featured ? "(min-width: 1024px) 600px, 92vw" : "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 92vw"}
          placeholder="blur"
          className="object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-forest-700 shadow-soft">
          {post.category}
        </span>
      </div>
      <div className={cn("flex flex-1 flex-col p-6 sm:p-7", featured && "lg:justify-center lg:p-12")}>
        <p className="text-sm text-ink-400">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          {readingMinutes(post)} min read
        </p>
        <h3
          className={cn(
            "mt-3 font-display font-bold leading-snug tracking-tight text-ink-950",
            featured ? "text-2xl sm:text-[2rem] sm:leading-tight" : "text-xl",
          )}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className={cn("mt-3 flex-1 leading-relaxed text-ink-500", featured ? "text-lg lg:flex-none" : "text-[0.9375rem]")}>
          {post.excerpt}
        </p>
        <span aria-hidden="true" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest-700">
          Read article
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
