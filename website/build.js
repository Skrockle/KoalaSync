/**
 * KoalaSync Static Site Generator (i18n compiler)
 * Pure, dependency-free Node.js build pipeline.
 */

const fs = require('fs');
const path = require('path');

// Helper to recursively copy directories
function copyDirSync(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function compile() {
    console.log('Starting KoalaSync i18n compilation...');

    const websiteDir = __dirname;
    const wwwDir = path.join(websiteDir, 'www');

    // 1. Create build directories
    fs.mkdirSync(wwwDir, { recursive: true });

    // 2. Read template
    const templatePath = path.join(websiteDir, 'template.html');
    if (!fs.existsSync(templatePath)) {
        console.error('Error: template.html not found! Run from website/ directory or repo root.');
        process.exit(1);
    }
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    const localesDir = path.join(websiteDir, 'locales');
    const languages = ['en', 'de', 'fr', 'es', 'pt-BR', 'ru'];

    // 3. Compile helper function
    function compilePage(locale, assetPath, lang) {
        let compiled = templateContent;

        // Inject asset path prefix first
        compiled = compiled.replace(/\{\{ASSET_PATH\}\}/g, assetPath);

        // Inject selected state for the dropdown
        languages.forEach(l => {
            const placeholder = `{{SELECTED_${l.toUpperCase()}}}`;
            compiled = compiled.replace(new RegExp(placeholder, 'g'), l === lang ? 'selected' : '');
        });

        // Inject all translations
        for (let [key, value] of Object.entries(locale)) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            compiled = compiled.replace(regex, value);
        }

        return compiled;
    }

    // 4. Generate HTML files
    for (let lang of languages) {
        const localePath = path.join(localesDir, `${lang}.json`);
        if (!fs.existsSync(localePath)) {
            console.warn(`Warning: Locale file for ${lang} not found.`);
            continue;
        }
        const locale = JSON.parse(fs.readFileSync(localePath, 'utf8'));

        if (lang === 'en') {
            console.log('Compiling English version (index.html)...');
            const enHtml = compilePage(locale, '', lang);
            fs.writeFileSync(path.join(wwwDir, 'index.html'), enHtml, 'utf8');
        } else {
            console.log(`Compiling ${lang.toUpperCase()} version (${lang}/index.html)...`);
            const langDir = path.join(wwwDir, lang);
            fs.mkdirSync(langDir, { recursive: true });
            const langHtml = compilePage(locale, '../', lang);
            fs.writeFileSync(path.join(langDir, 'index.html'), langHtml, 'utf8');
        }
    }

    // 5. Copy static assets
    console.log('Copying assets and static website files...');
    const staticFiles = [
        'style.css',
        'app.js',
        'lang-init.js',
        'robots.txt',
        'sitemap.xml',
        'version.json',
        'join.html',
        'impressum.html',
        'datenschutz.html'
    ];

    for (let file of staticFiles) {
        const srcPath = path.join(websiteDir, file);
        const destPath = path.join(wwwDir, file);
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied: ${file}`);
        } else {
            console.warn(`Warning: Static file ${file} not found.`);
        }
    }

    // Copy assets folder recursively
    const srcAssets = path.join(websiteDir, 'assets');
    const destAssets = path.join(wwwDir, 'assets');
    if (fs.existsSync(srcAssets)) {
        copyDirSync(srcAssets, destAssets);
        console.log('Copied assets directory recursively.');
    } else {
        console.error('Error: assets/ directory not found in website/.');
    }

    console.log('KoalaSync compilation finished successfully! Output is in website/www/');
}

compile();
