addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Expected POST JSON body: { products: string, settings: string, secret: string }
 * Secret must match ADMIN_PUBLISH_SECRET bound to the Worker.
 */
async function handleRequest(request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { products, settings, secret } = body || {};
  const ADMIN_SECRET = ADMIN_PUBLISH_SECRET; // bound as a Worker secret
  const GH_PAGES_PAT = GH_PAGES_PAT; // bound as a Worker secret

  if (!secret || secret !== ADMIN_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!GH_PAGES_PAT) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const owner = "Revita-Plastics";
  const repo = "revita";
  const url = `https://api.github.com/repos/${owner}/${repo}/dispatches`;
  const payload = {
    event_type: "save-data",
    client_payload: {
      products: products || "",
      settings: settings || "",
    },
  };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `token ${GH_PAGES_PAT}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (resp.ok || resp.status === 202) {
      return new Response("Dispatched", { status: 202 });
    }

    const text = await resp.text();
    return new Response("GitHub error: " + text, { status: resp.status });
  } catch (err) {
    return new Response("Request failed: " + err.message, { status: 502 });
  }
}
