import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultContent from '../data/content.json';
import { github } from '../services/github';

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    // Try to fetch latest content from GitHub to allow "CMS-like" updates without rebuild
    // Note: This relies on the file being available via API or raw
    // For now we assume the built-in json is the fallback, and we try to fetch dynamic.
    // Ideally we fetch from the repo if configured.
    const fetchContent = async () => {
        const owner = localStorage.getItem('revita_owner') || 'Revita-Plastics';
        const repo = localStorage.getItem('revita_repo') || 'revita';
        // We can't use github.getFile without token for private repos, but for public it might work if we have a helper 
        // OR we just use raw.githubusercontent.com for public
        // OR we rely on the deploy.
        
        // Strategy: Use the bundled content by default (fast).
        // If we want dynamic updates, we'd need a way to get it.
        // For this task, "bootleg CMS", we will assume the User will "Save" in admin, which commits to repo.
        // The deploy will update the site.
        // BUT, if we want to preview or have it strictly dynamic:
        
        // Let's stick to using the imported JSON for the MAIN site for performance.
        // The Admin panel will fetch fresh data.
        // However, user asked for "bootleg builder", which implies some dynamism?
        // If we edit in Admin, it saves to GitHub. The live site won't update until rebuild/deploy 
        // UNLESS we fetch the raw JSON on mount.
        
        try {
            // Attempt to fetch raw content if we are online and repo is public
            // const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/src/data/content.json`);
            // if (res.ok) {
            //    const data = await res.json();
            //    setContent(data);
            // }
        } catch (e) {
            console.error("Failed to fetch dynamic content", e);
        }
    };
    
    // fetchContent(); 
    // Commented out to ensure stability on start. We will rely on build-time content for now, 
    // unless user specifically requested "live without build". 
    // For "Website Builder" feel, the Admin Panel preview is key.
  }, []);

  return (
    <ContentContext.Provider value={{ content, setContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
