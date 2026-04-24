import "dotenv/config";

function readGithubConfig() {
  return {
    token: process.env.GITHUB_TOKEN?.trim(),
    repository: process.env.GITHUB_REPOSITORY?.trim(),
    branch: process.env.GITHUB_BRANCH?.trim() || "main",
    authorName: process.env.GITHUB_AUTHOR_NAME?.trim() || "Renvoo Blog Bot",
    authorEmail:
      process.env.GITHUB_AUTHOR_EMAIL?.trim() || "renvoo-bot@users.noreply.github.com",
  };
}

function encodeBase64(value) {
  return Buffer.from(value, "utf8").toString("base64");
}

export async function publishFileToGitHub({ filePath, content, message }) {
  const github = readGithubConfig();

  if (!github.token || !github.repository) {
    throw new Error("GITHUB_TOKEN and GITHUB_REPOSITORY are required for GitHub persistence.");
  }

  const endpoint = `https://api.github.com/repos/${github.repository}/contents/${filePath}`;
  const currentResponse = await fetch(`${endpoint}?ref=${encodeURIComponent(github.branch)}`, {
    headers: {
      Authorization: `Bearer ${github.token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "RenvooBlogBot/1.0",
    },
  });

  let sha;
  if (currentResponse.ok) {
    const current = await currentResponse.json();
    sha = current.sha;
  }

  if (!currentResponse.ok && currentResponse.status !== 404) {
    const errorText = await currentResponse.text();
    throw new Error(`Could not inspect GitHub file state (${currentResponse.status}): ${errorText}`);
  }

  const writeResponse = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${github.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "RenvooBlogBot/1.0",
    },
    body: JSON.stringify({
      message,
      content: encodeBase64(content),
      branch: github.branch,
      sha,
      committer: {
        name: github.authorName,
        email: github.authorEmail,
      },
    }),
  });

  if (!writeResponse.ok) {
    const errorText = await writeResponse.text();
    throw new Error(`Could not publish blog post to GitHub (${writeResponse.status}): ${errorText}`);
  }

  return writeResponse.json();
}
