import { defineConfig } from 'vitepress'

// For a project page (user.github.io/repo/) set BASE=/repo/ at build time.
// For a custom domain or user/org page leave it as "/".
export default defineConfig({
  title: 'Times Produce',
  description:
    'Los Angeles-based wholesale produce distributor with over 70 years in the industry, serving customers worldwide.',
  base: process.env.BASE ?? '/',
  cleanUrls: true,
  appearance: false,
  head: [['link', { rel: 'icon', href: (process.env.BASE ?? '/') + 'images/clocktower.png' }]],
})
