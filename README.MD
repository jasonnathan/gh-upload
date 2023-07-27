# GitHub Repo Push Script

[![Build Status](https://img.shields.io/github/workflow/status/jasonnathan/gh-upload/tests.yml?branch=master&logo=github&style=flat-square)](https://github.com/jasonnathan/gh-upload/actions)
[![Test Coverage](https://img.shields.io/codecov/c/gh/jasonnathan/gh-upload?logo=codecov&style=flat-square)](https://codecov.io/gh/jasonnathan/gh-upload)
[![License](https://img.shields.io/github/license/jasonnathan/gh-upload?style=flat-square)](https://github.com/jasonnathan/gh-upload/blob/master/LICENSE)


This script allows you to create new GitHub repositories for local folders and push their contents to the corresponding GitHub organization. It is written in Node.js and utilizes various npm packages to interact with the GitHub API and perform Git operations.

## Prerequisites

Before using this script, ensure you have the following installed:

1. Node.js (https://nodejs.org)
2. npm (Node Package Manager) - This comes bundled with Node.js.

## Setup

1. Clone this repository to your local machine.
2. Navigate to the project directory and install the required dependencies:

```bash
npm install
```

3. Create a `.env` file in the project directory with the following environment variables:

```plaintext
GITHUB_ORGANIZATION=your_github_organization
GITHUB_TOKEN=your_github_personal_access_token
LOCAL_REPO_PATH=path_to_local_repositories
```

Replace `your_github_organization`, `your_github_personal_access_token`, and `path_to_local_repositories` with your actual GitHub organization name, personal access token, and the path to the directory containing your local repositories, respectively.

## Usage

To use the script, execute the following command in the project directory:

```bash
node gh-repo-push.js
```

The script will prompt you to provide the GitHub Organization, GitHub Personal Access Token, and Local Repository Path if they are not already set in the `.env` file.

Once you have provided the required information, the script will:

1. Create new GitHub repositories for each folder in the specified Local Repository Path.
2. Push the contents of each local repository to the corresponding GitHub repository.

Please note that the script will automatically remove any existing remote references in your local repositories to non-existent GitHub repositories.

## Important Note

- Ensure that your GitHub Personal Access Token has the necessary permissions to create repositories in the specified GitHub Organization.

## License

This script is licensed under the MIT License. Feel free to use, modify, and distribute it as per the terms of the license.

For any questions or issues related to the script, please feel free to open an issue in the GitHub repository: [link_to_github_repo](https://github.com/jasonnathan/gh-upload).

---
Author: [Jason Nathan](https://github.com/jasonnathan)