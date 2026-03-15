import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace table names in queries
  content = content.replace(/from\('jobs'\)/g, "from('vacancies')");
  content = content.replace(/jobs \(/g, "vacancies (");
  content = content.replace(/jobs:\s*jobs/g, "vacancies:vacancies");
  
  // Replace foreign keys
  content = content.replace(/job_id/g, "vacancy_id");
  
  // Replace object access
  content = content.replace(/\.jobs\?/g, ".vacancies?");
  content = content.replace(/\.jobs\./g, ".vacancies.");
  
  // Replace company_name with full_name
  content = content.replace(/company_name/g, "full_name");
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        walkDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir('./app');
walkDir('./components');
