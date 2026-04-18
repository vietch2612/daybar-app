// ── DMG download proxy ──────────────────────────────────────────────────────
// Fetches the latest GitHub release from the private repo and redirects the
// user to a temporary pre-signed download URL that works without auth.
//
// Usage:
//   /download/arm64   →  latest arm64 DMG
//   /download/x64     →  latest x64 (Intel) DMG
//
// Requires GITHUB_TOKEN env var in Netlify with `repo` scope.
// ─────────────────────────────────────────────────────────────────────────────

const REPO = 'vietch2612/daybar-app';

exports.handler = async (event) => {
  const arch = (event.path || '').includes('x64') ? 'x64' : 'arm64';
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return { statusCode: 500, body: 'Server misconfigured — missing GITHUB_TOKEN' };
  }

  try {
    // 1. Get the latest release metadata
    const releaseRes = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'daybar-website',
        },
      }
    );

    if (!releaseRes.ok) {
      return { statusCode: 502, body: `GitHub API error: ${releaseRes.status}` };
    }

    const release = await releaseRes.json();

    // 2. Find the matching DMG asset
    const asset = release.assets.find((a) => {
      if (!a.name.endsWith('.dmg')) return false;
      if (arch === 'arm64') return a.name.includes('arm64');
      // x64 build: the DMG without "arm64" in its name
      return !a.name.includes('arm64');
    });

    if (!asset) {
      return { statusCode: 404, body: `No ${arch} DMG found in release ${release.tag_name}` };
    }

    // 3. Request the asset binary — GitHub responds with a 302 to a
    //    temporary pre-signed S3 URL that works without authentication.
    const assetRes = await fetch(asset.url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/octet-stream',
        'User-Agent': 'daybar-website',
      },
      redirect: 'manual',
    });

    const downloadUrl = assetRes.headers.get('location');

    if (!downloadUrl) {
      return { statusCode: 502, body: 'GitHub did not return a download redirect' };
    }

    // 4. Redirect the user to the pre-signed URL — their browser downloads
    //    the DMG directly from GitHub's CDN, no auth needed.
    return {
      statusCode: 302,
      headers: { Location: downloadUrl },
    };
  } catch (err) {
    return { statusCode: 500, body: `Download error: ${err.message}` };
  }
};
