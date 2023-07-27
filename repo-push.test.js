const {
  readEnvFile,
  saveEnvFile,
  createGithubRepo,
  main,
} = require('./repo-push');
const fs = require('fs');
const { spawnSync } = require('child_process');
const fetch = require('cross-fetch');
const readline = require('readline');
const dotenv = require('dotenv');

// Mocking the fetch function
jest.mock('cross-fetch');
fetch.mockResolvedValue({
  json: () => ({ 
    name: 'test_repo', 
    clone_url: 'https://github.com/test_org/test_repo.git' 
  }),
});

// Mocking file system functions
jest.mock('fs');
fs.readFileSync.mockReturnValue('GITHUB_ORGANIZATION=org\nGITHUB_TOKEN=token\nLOCAL_REPO_PATH=path');
fs.writeFileSync.mockImplementation(() => {});
fs.readdirSync.mockReturnValue([
  { name: 'repo1', isDirectory: () => true },
  { name: 'repo2', isDirectory: () => true },
]);

// Tests
describe('Testing Main Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();

  });

  test('readEnvFile should read the .env file', () => {
    const envConfig = readEnvFile();
    expect(envConfig).toEqual({
      GITHUB_ORGANIZATION: 'org',
      GITHUB_TOKEN: 'token',
      LOCAL_REPO_PATH: 'path',
    });
  });

  test('saveEnvFile should save data to .env file', () => {
    const data = {
      GITHUB_ORGANIZATION: 'test_org',
      GITHUB_TOKEN: 'test_token',
      LOCAL_REPO_PATH: 'test_path',
    };
    saveEnvFile(data);
    expect(fs.writeFileSync).toHaveBeenCalledWith('.env', 'GITHUB_ORGANIZATION=test_org\nGITHUB_TOKEN=test_token\nLOCAL_REPO_PATH=test_path');
  });

  test('createGithubRepo should create a GitHub repository', async () => {
    const githubOrganization = 'test_org';
    const githubToken = 'test_token';
    const repoName = 'test_repo';

    const response = await createGithubRepo(githubOrganization, githubToken, repoName);

    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/orgs/test_org/repos',
      {
        method: 'POST',
        headers: {
          Authorization: 'token test_token',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          name: 'test_repo',
          private: true,
        }),
      }
    );

    expect(response).toEqual({
      name: 'test_repo',
      clone_url: 'https://github.com/test_org/test_repo.git',
    });
  });

  test('main should run without errors', async () => {
    jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
      return ['test_answer', 'test_answer', 'test_answer']
    })


    await main();
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
