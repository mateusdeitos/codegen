import { Dirent, readdirSync } from 'fs';
import path from 'path';

const findFileNameRecursive = (baseDir: string, fileName: string): string[] => {

	const isInsideNodeModules = (file: Dirent) => {
		return file.name.includes('node_modules');
	}

	const files = [];

	readdirSync(baseDir, { withFileTypes: true }).forEach((file) => {
		if (file.isDirectory() && !isInsideNodeModules(file)) {
			files.push(...findFileNameRecursive(path.join(baseDir, file.name), fileName));
		}

		if (file.name === fileName && !isInsideNodeModules(file)) {
			files.push(path.join(baseDir, file.name));
		}

	});

	return files;
}

export const file = {
	findFileNameRecursive
}

