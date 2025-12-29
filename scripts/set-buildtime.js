const fs = require('fs');
const path = require('path');

// Ścieżki do plików environment
const envFiles = [
  path.join(__dirname, '../src/environments/environment.ts'),
  path.join(__dirname, '../src/environments/environment.dev.ts'),
  path.join(__dirname, '../src/environments/environment.prod.ts')
];

// Ustaw timestamp builda
const buildtime = new Date().toISOString();
console.log(`Setting buildtime to: ${buildtime}`);

envFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Zastąp buildtime aktualnym timestampem
    // Obsługuje zarówno 'BUILDTIME_PLACEHOLDER' jak i istniejące wartości timestampu
    if (content.includes('buildtime:')) {
      content = content.replace(
        /buildtime:\s*(['"])(?:BUILDTIME_PLACEHOLDER|[^'"]*)\1/g,
        `buildtime: '${buildtime}'`
      );
    } else {
      // Jeśli buildtime nie istnieje, dodaj go po buildType
      content = content.replace(
        /(\s+)(buildType:\s*['"][^'"]+['"])(\s*)([,}])/,
        `$1$2,$3  buildtime: '${buildtime}'$3$4`
      );
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('Buildtime set successfully');

