import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Два проекта, а не одно общее окружение.
 *
 * Глобальный jsdom роняет тесты скриптов: под ним `import.meta.url` становится
 * http-адресом страницы jsdom, и `readFileSync(new URL('…', import.meta.url))`
 * падает с «The URL must be of scheme file». Фикстуры читаются именно так,
 * поэтому скриптам нужен node.
 *
 * Разделение по маскам через environmentMatchGlobs в Vitest 3 объявлено
 * устаревшим; projects — его штатная замена.
 */
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'scripts',
          include: ['scripts/**/*.test.mjs'],
          environment: 'node'
        }
      },
      {
        plugins: [react()],
        test: {
          name: 'ds',
          include: ['ds/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts']
        }
      }
    ]
  }
});
