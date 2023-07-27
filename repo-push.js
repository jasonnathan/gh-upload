const fs = require('fs');
const { spawnSync } = require('child_process');
const fetch = require('cross-fetch');
const readline = require('readline');
const dotenv = require('dotenv');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readEnvFile = () => {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    return envConfig;
  } catch (err) {
    return {};
  }
};

const saveEnvFile = (data) => {
  const envConfig = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  fs.writeFileSync('.env', envConfig);
};

const promptQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

const createGithubRepo = async (githubOrganization, githubToken, repoName) => {
  const url = `https://api.github.com/orgs/${githubOrganization}/repos`;
  const headers = {
    Authorization: `token ${githubToken}`,
    Accept: 'application/vnd.github.v3+json',
  };
  const data = {
    name: repoName,
    private: true, // Set this to true if you want private repos
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  return response.json();
};
const main = async () => {
  const envConfig = readEnvFile();

  let githubOrganization = envConfig.GITHUB_ORGANIZATION;
  let githubToken = envConfig.GITHUB_TOKEN;
  let localRepoPath = envConfig.LOCAL_REPO_PATH;

  if (!githubOrganization) {
    githubOrganization = await promptQuestion('Enter GitHub Organization: ');
  }

  if (!githubToken) {
    githubToken = await promptQuestion('Enter GitHub Personal Access Token: ');
  }

  if (!localRepoPath) {
    localRepoPath = await promptQuestion('Enter Local Repository Path: ');
  }

  saveEnvFile({
    GITHUB_ORGANIZATION: githubOrganization,
    GITHUB_TOKEN: githubToken,
    LOCAL_REPO_PATH: localRepoPath,
  });

  const folders = fs.readdirSync(localRepoPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const folder of folders) {
    const repoName = folder;
    const createRepoResponse = await createGithubRepo(githubOrganization, githubToken, repoName);

    if (createRepoResponse.message === 'Not Found') {
      console.log(`Error creating repository ${repoName}: Organization not found.`);
      continue;
    }

    console.log(`Repository ${repoName} created successfully.`);

    const localRepoFolder = `${localRepoPath}/${folder}`;
    const gitConfigFile = `${localRepoFolder}/.git/config`;

    // Remove the existing remote pointing to the non-existent repository
    const gitConfigContent = fs.readFileSync(gitConfigFile, 'utf-8');
    const newGitConfigContent = gitConfigContent.replace(/url\s*=\s*.*\n/, '');
    fs.writeFileSync(gitConfigFile, newGitConfigContent);

    try {
      spawnSync(`git`, ['-C', localRepoFolder, 'init']);
      spawnSync(`git`, ['-C', localRepoFolder, 'add', '.']);
      spawnSync(`git`, ['-C', localRepoFolder, 'commit', '-m', 'Initial commit']);
      spawnSync(`git`, ['-C', localRepoFolder, 'remote', 'add', 'origin', createRepoResponse.clone_url]);
      spawnSync(`git`, ['-C', localRepoFolder, 'push', '-u', 'origin', 'master']);

      console.log(`Local repository ${repoName} pushed to GitHub successfully.`);
    } catch (error) {
      console.error(`Error pushing local repository ${repoName} to GitHub:`);
      console.error(error.message);
    }
  }

  rl && rl.close();
};
module.exports = {
  readEnvFile,
  saveEnvFile,
  createGithubRepo,
  main
}
