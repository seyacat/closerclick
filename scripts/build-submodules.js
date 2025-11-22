const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SUBMODULES_DIR = path.join(__dirname, '..', 'submodules');
const FRONTEND_APP_DIR = path.join(__dirname, '..', 'frontend', 'public','app');

function buildSubmodules() {
  console.log('Building submodules...');
  
  // Ensure frontend/app directory exists
  if (!fs.existsSync(FRONTEND_APP_DIR)) {
    fs.mkdirSync(FRONTEND_APP_DIR, { recursive: true });
    console.log(`Created directory: ${FRONTEND_APP_DIR}`);
  }

  // Get all submodule directories
  const submodules = fs.readdirSync(SUBMODULES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (submodules.length === 0) {
    console.log('No submodules found in submodules directory');
    return;
  }

  console.log(`Found ${submodules.length} submodules: ${submodules.join(', ')}`);

  // Build each submodule
  for (const submodule of submodules) {
    const submodulePath = path.join(SUBMODULES_DIR, submodule);
    // Remove "closerclick_" prefix from output directory name
    const outputDirName = submodule.replace(/^closerclick_/, '');
    const outputDir = path.join(FRONTEND_APP_DIR, outputDirName);

    console.log(`\nBuilding submodule: ${submodule}`);
    console.log(`Submodule path: ${submodulePath}`);
    console.log(`Output directory: ${outputDir} (from ${submodule})`);

    try {
      // Check if submodule has package.json
      const packageJsonPath = path.join(submodulePath, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        console.log(`Warning: No package.json found in ${submodule}, skipping`);
        continue;
      }

      // Check if build script exists in package.json
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (!packageJson.scripts || !packageJson.scripts.build) {
        console.log(`Warning: No build script found in ${submodule}/package.json, skipping`);
        continue;
      }

      // Run npm install if node_modules doesn't exist
      
      console.log(`Installing dependencies for ${submodule}...`);
      execSync('npm install', { cwd: submodulePath, stdio: 'inherit' });
      

      // Run build command with output directory using environment variable
      console.log(`Running build for ${submodule}...`);
      const env = { ...process.env, VITE_OUT_DIR: outputDir };
      execSync(`npm run build`, {
        cwd: submodulePath,
        stdio: 'inherit',
        env: env
      });

      console.log(`Successfully built ${submodule} to ${outputDir}`);

    } catch (error) {
      console.error(`Error building submodule ${submodule}:`, error.message);
      console.log(`Continuing with next submodule...`);
      continue;
    }
  }

  console.log('\nBuild process completed!');
}

// Run the build process
buildSubmodules();