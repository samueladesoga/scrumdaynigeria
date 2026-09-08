import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';

export async function GET(context) {
  const site = await getEntry('site', 'config');
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: site.data.eventName,
    description: site.data.tagline,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
