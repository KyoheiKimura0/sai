import fs from 'fs-extra';
import path from 'path';
import * as replace from 'replace-in-file';
import dotenv from 'dotenv';

dotenv.config();


/**
 * ビルドスクリプト
 * 指定されたターゲットフォルダの内容をビルドディレクトリにコピーし、必要な置換を行います。
 *
 * @param tagetDomain
 * @param pageFolder
 */
async function runBuild(tagetDomain: string, pageFolder: string): Promise<void> {
    try {
        // 例：saiamtest.com/1pkl
        const targetFolder = path.join(tagetDomain, pageFolder);

        const baseDir = path.resolve(__dirname, '../../public/domain/', targetFolder);
        const r2BaseUrl = process.env.R2_PUBLIC_URL; // 環境変数から取得

        if (!fs.existsSync(baseDir)) {
            Error(`Base directory does not exist: ${baseDir}`);
            return;
        }
        if (!r2BaseUrl) {
            Error('R2_PUBLIC_URL environment variable is not set.');
            return;
        }
        console.log(`R2 Base URL: ${r2BaseUrl}`);

        // buildディレクトリにtagetFolderの内容をコピー
        const buildDir = path.resolve(__dirname, '../../build/', targetFolder);
        await fs.ensureDir(buildDir);
        await fs.copy(baseDir, buildDir, {
            filter: (src) => !src.includes('node_modules') && !src.includes('build') && !src.includes('images')
        });

        // utilsフォルダもコピー
        const utilsDir = path.resolve(__dirname, './utils');
        const buildUtilsDir = path.resolve(__dirname, '../../build/', tagetDomain, 'utils');
        await fs.ensureDir(buildUtilsDir);
        await fs.copy(utilsDir, buildUtilsDir, {
            filter: (src) => !src.includes('node_modules') && !src.includes('build')
        });

        // window.UTILS_PATHの値を置換
        await replace.replaceInFile({
            files: path.join(buildDir, '**/index.html'),
            from: /window\.UTILS_PATH\s*=\s*['"`][^'"`]*['"`];/g,
            to: `window.UTILS_PATH = '/utils/js/';`,
        });

        // imagesフォルダのパスを置換
        await replace.replaceInFile({
            files: path.join(buildDir, '**/*.html'),
            from: /src="images\//g,
            to: (...args) => {
                const file = args[args.length - 1];
                const folder = file.includes('/pc/') ? 'pc' : file.includes('/sp/') ? 'sp' : '';
                return `src="${r2BaseUrl}/${targetFolder}/${folder ? folder + '/' : ''}`;
            }
        });

        // css内の../images/パスもR2のURLに置換
        await replace.replaceInFile({
            files: path.join(buildDir, '**/*.css'),
            from: /url\(["']?\.\.\/images\//g,
            to: (...args) => {
                const file = args[args.length - 1];
                const folder = file.includes('/pc/') ? 'pc' : file.includes('/sp/') ? 'sp' : '';
                return `url("${r2BaseUrl}/${targetFolder}/${folder ? folder + '/' : ''}`;
            }
        });

        console.log('\nBuild script completed successfully.');

    } catch (error) {
        console.error('Error during build script execution:', error);
        process.exit(1);
    }
}

// コマンドライン引数を取得
const [targetDomain, pageFolder] = process.argv.slice(2);

if (!targetDomain || !pageFolder) {
    console.error('エラー: targetDomain と pageFolder を引数として指定してください。');
    console.log('使用法: ts-node public/scripts/build.ts <targetDomain> <pageFolder>');
    console.log('例: ts-node public/scripts/build.ts saiamtest.com 1pkl');
    process.exit(1);
}

runBuild(targetDomain, pageFolder).then();