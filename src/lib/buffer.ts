export async function fetchBufferProfiles(token: string) {
  const response = await fetch("https://api.bufferapp.com/1/profiles.json", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Buffer profiles error: ${details}`);
  }

  return response.json();
}

export async function createBufferUpdate(params: {
  token: string;
  profileId: string;
  text: string;
  scheduledAt?: string;
  mediaUrl?: string;
}) {
  const form = new URLSearchParams();
  form.set("text", params.text);
  form.set("profile_ids[]", params.profileId);

  if (params.scheduledAt) {
    const unix = Math.floor(new Date(params.scheduledAt).getTime() / 1000);
    form.set("scheduled_at", String(unix));
    form.set("now", "false");
  } else {
    form.set("now", "true");
  }

  if (params.mediaUrl) {
    form.set("media[photo]", params.mediaUrl);
  }

  const response = await fetch("https://api.bufferapp.com/1/updates/create.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

  const data = await response.json();
  if (!response.ok || data?.success === false) {
    throw new Error(data?.message ?? "Failed to create Buffer update");
  }

  return data;
}
