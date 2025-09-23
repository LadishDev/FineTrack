// Utility to fetch the latest release version from GitHub
export async function fetchLatestGitHubVersion(): Promise<{version: string, url: string}|null> {
  try {
    const res = await fetch('https://api.github.com/repos/LadishDev/FineTrack/releases/latest');
    if (!res.ok) return null;
    const data = await res.json();
    // Tag name is usually the version, e.g. "v0.1.2" or "0.1.2"
    let version = data.tag_name || '';
    if (version.startsWith('v')) version = version.slice(1);
    return { version, url: data.html_url };
  } catch {
    return null;
  }
}
