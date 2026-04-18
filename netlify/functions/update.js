// ── Auto-update proxy ───────────────────────────────────────────────────────
// Serves electron-updater files (latest-mac.yml, ZIPs) from the private
// GitHub repo so the packaged app can check for updates without a token.
//
// Routes:
//   /update/latest-mac.yml   →  YAML metadata (version, sha512, filename)
//   /update/Daybar-*.zip     →  302 redirect to pre-signed GitHub asset URL
//
// Requires GITHUB_TOKEN env var in Netlify with repo read access.
// ─────────────────────────────────────────────────────────────────────────────

const REPO = 'vietch2612/daybar-app';

exports.handler = async (event) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { statusCode: 500, body: 'Server misconfigured — missing GITHUB_TOKEN' };
  }

  // Extract the requested filename from the path
  // e.g. /update/latest-mac.yml → latest-mac.yml
  //      /update/Daybar-1.0.1-arm64-mac.zip → Daybar-1.0.1-arm64-mac.zip
  //      /update/release-notes → JSON release notes for the update window
  const path = (event.path || '').replace(/^\/update\/?/, '') || 'latest-mac.yml';

  try {
    // 1. Get latest release
    const releaseRes = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'daybar-updater',
        },
      }
    );

    if (!releaseRes.ok) {
      return { statusCode: 502, body: `GitHub API error: ${releaseRes.status}` };
    }

    const release = await releaseRes.json();

    // Release notes endpoint — returns JSON with version + body markdown
    if (path === 'release-notes') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          version: release.tag_name?.replace(/^v/, '') || '',
          name: release.name || '',
          body: release.body || '',
        }),
      };
    }

    // 2. Find the matching asset
    const asset = release.assets.find((a) => a.name === path);
    if (!asset) {
      return { statusCode: 404, body: `Asset "${path}" not found in release ${release.tag_name}` };
    }

    // 3. For YAML files: return the content directly (small, text-based)
    if (path.endsWith('.yml') || path.endsWith('.yaml')) {
      const yamlRes = await fetch(asset.url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/octet-stream',
          'User-Agent': 'daybar-updater',
        },
      });

      const body = await yamlRes.text();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/yaml',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body,
      };
    }

    // 4. For binary files (ZIPs): redirect to pre-signed URL
    const assetRes = await fetch(asset.url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/octet-stream',
        'User-Agent': 'daybar-updater',
      },
      redirect: 'manual',
    });

    const downloadUrl = assetRes.headers.get('location');
    if (!downloadUrl) {
      return { statusCode: 502, body: 'GitHub did not return a download redirect' };
    }

    return {
      statusCode: 302,
      headers: { Location: downloadUrl },
    };
  } catch (err) {
    return { statusCode: 500, body: `Update proxy error: ${err.message}` };
  }
};
