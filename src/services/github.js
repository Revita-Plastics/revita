const BASE_URL = 'https://api.github.com';

export const github = {
  /**
   * Validate token and get user info
   */
  async getUser(token) {
    const res = await fetch(`${BASE_URL}/user`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (!res.ok) throw new Error('Invalid Token');
    return res.json();
  },

  /**
   * Get file content and SHA
   */
  async getFile(token, owner, repo, path) {
    const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/contents/${path}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28'
     }
    });
    
    if (!res.ok) {
        throw new Error(`Failed to fetch file: ${res.statusText}`);
    }

    const data = await res.json();
    
    // Content is base64 encoded. 
    // Need to handle UTF-8 properly (atob can fail on some unicode).
    const content = decodeURIComponent(escape(atob(data.content)));
    
    return {
      sha: data.sha,
      content: JSON.parse(content)
    };
  },

  /**
   * Update file content
   */
  async updateFile(token, owner, repo, path, content, sha, message) {
    // Encode to Base64 (handle Unicode)
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));
    
    const res = await fetch(`${BASE_URL}/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message,
        content: encoded,
        sha
      })
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update');
    }
    
    return res.json();
  }
};
