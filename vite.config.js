import { defineConfig, loadEnv } from 'vite';

function normalizeBase(value = '/') {
  if (value === './') return './';

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: normalizeBase(env.VITE_BASE_PATH || '/'),
  };
});
