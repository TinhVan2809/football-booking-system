import { useEffect, useState } from "react";

function useUserData(url) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`ERROR HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data?.success) {
          setUser(data.data ?? null);
        } else {
          setUser(null);
          setError(data?.message || "Fetch user failed");
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => controller.abort();
  }, [url]);

  return { user, loading, error };
}

export default useUserData;

