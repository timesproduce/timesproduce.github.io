import { defineConfig } from 'vitepress'

// For a project page (user.github.io/repo/) set BASE=/repo/ at build time.
// For a custom domain or user/org page leave it as "/".
export default defineConfig({
  title: 'Times Produce',
  description:
    'Times Produce is a Los Angeles wholesale produce distributor with more than 70 years of experience, shipping fresh fruits and vegetables worldwide.',
  base: process.env.BASE ?? '/',
  cleanUrls: true,
  appearance: false,
  head: [['link', { rel: 'icon', href: (process.env.BASE ?? '/') + 'images/clocktower.png' }]],
})
