import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import fs from 'fs';
import packageVersions from 'pkg-versions';
import eslint4b from 'vite-plugin-eslint4b';

function getPkg(moduleName: string) {
	// eslint-disable-next-line no-shadow -- name
	const { name, homepage, version } = JSON.parse(
		fs.readFileSync(`./node_modules/${moduleName}/package.json`, 'utf8')
	);

	return { name, homepage, version };
}

export default (async (): Promise<UserConfig> => {
	return {
		plugins: [eslint4b(), sveltekit()],
		define: {
			__DEPS_PKGS__: {
				'eslint-plugin-security': getPkg('eslint-plugin-security'),
				eslint: getPkg('eslint')
			},
			__PKG_VERSIONS__: {
				'eslint-plugin-security': [...(await packageVersions('eslint-plugin-security'))].sort(
					(a, b) => b.localeCompare(a)
				)
			},
			MONACO_EDITOR_VERSION: JSON.stringify(getPkg('monaco-editor').version)
		}
	};
})();
