import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

// .envファイルから環境変数を読み込む
dotenv.config();

/**
 * 指定されたローカルのimagesディレクトリをCloudflare R2に同期する関数
 * @param targetDomain アップロード対象のドメイン名 (例: "saiamtest.com")
 * @param pageFolder アップロード対象のページフォルダ名 (例: "1pkl")
 */
async function deployImagesToR2(targetDomain: string, pageFolder: string): Promise<void> {
    const r2BucketName = process.env.R2_BUCKET_NAME;
    const r2AccountId = process.env.R2_ACCOUNT_ID;
    const rcloneRemoteName = process.env.RCLONE_REMOTE_NAME; // Rcloneのリモート名

    // 環境変数のチェック
    if (!r2BucketName) {
        console.error('エラー: 環境変数 R2_BUCKET_NAME が設定されていません。');
        process.exit(1);
    }
    if (!r2AccountId) {
        console.error('エラー: 環境変数 R2_ACCOUNT_ID が設定されていません。');
        process.exit(1);
    }
    if (!rcloneRemoteName) {
        console.error('エラー: 環境変数 RCLONE_REMOTE_NAME が設定されていません。');
        process.exit(1);
    }

    // 同期するローカルのimagesディレクトリのパス
    const localPcImagesDir = path.resolve(__dirname, '../../public/domain', targetDomain, pageFolder, 'pc', 'images');
    const localSpImagesDir = path.resolve(__dirname, '../../public/domain', targetDomain, pageFolder, 'sp', 'images');
    // R2バケット内のアップロード先プレフィックス
    const r2PcPrefix = `${targetDomain}/${pageFolder}/pc`;
    const r2SpPrefix = `${targetDomain}/${pageFolder}/sp`;

    // ローカルディレクトリの存在確認
    if (!fs.existsSync(localPcImagesDir)) {
        console.error(`エラー: ローカルのimagesディレクトリが見つかりません: ${localPcImagesDir}`);
        process.exit(1);
    }

    if (!fs.existsSync(localSpImagesDir)) {
        console.error(`エラー: ローカルのimagesディレクトリが見つかりません: ${localSpImagesDir}`);
        process.exit(1);
    }

    try {
        // Rcloneを使用してPC用イメージの同期
        const pcRcloneCommand = `rclone sync ${localPcImagesDir} ${rcloneRemoteName}:${r2BucketName}/${r2PcPrefix} --progress`;
        console.log(`実行中: ${pcRcloneCommand}`);
        execSync(pcRcloneCommand, { stdio: 'inherit' });
        console.log(`\n${localPcImagesDir} の R2バケット (${r2BucketName}/${r2PcPrefix}) への同期が成功しました。`);

        // SP用イメージの同期
        const spRcloneCommand = `rclone sync ${localSpImagesDir} ${rcloneRemoteName}:${r2BucketName}/${r2SpPrefix} --progress`;
        console.log(`実行中: ${spRcloneCommand}`);
        execSync(spRcloneCommand, { stdio: 'inherit' });
        console.log(`\n${localSpImagesDir} の R2バケット (${r2BucketName}/${r2SpPrefix}) への同期が成功しました。`);
    } catch (error) {
        console.error('\nR2への画像の同期中にエラーが発生しました:', error);
        process.exit(1);
    }
}

// コマンドライン引数を取得
const [targetDomain, pageFolder] = process.argv.slice(2);

if (!targetDomain || !pageFolder) {
    console.error('エラー: targetDomain と pageFolder を引数として指定してください。');
    console.log('使用法: ts-node public/scripts/deploy-r2-images.ts <targetDomain> <pageFolder>');
    console.log('例: ts-node public/scripts/deploy-r2-images.ts saiamtest.com 1pkl');
    process.exit(1);
}

// 同期処理を実行
deployImagesToR2(targetDomain, pageFolder).catch(error => {
    console.error('deployImagesToR2 関数でハンドルされないエラー:', error);
    process.exit(1);
});