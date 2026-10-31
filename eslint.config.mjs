import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import hooksPlugin from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		ignores: [
			'node_modules',
			'.next',
			'dist',
			'tailwind.config.ts',
			'next-env.d.ts',
			'.claude/worktrees/**',
			'.agents/skills/update-docs/**'
		]
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		plugins: {
			'@next/next': nextPlugin,
			'react-hooks': hooksPlugin
		},
		rules: {
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs['core-web-vitals'].rules,
			...hooksPlugin.configs.recommended.rules,
			// Plain <img> is deliberate, not an oversight. `next/image` was dropped so the
			// runtime container never loads sharp/libvips; `images.unoptimized` is set in
			// next.config.ts. Every asset in public/ is already WebP, so the optimizer was
			// buying nothing. Left on, this rule would emit a permanent warning per call site.
			'@next/next/no-img-element': 'off'
		}
	}
)
