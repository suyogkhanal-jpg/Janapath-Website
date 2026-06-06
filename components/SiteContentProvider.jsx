"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const SiteContentContext = createContext({
  content: null,
  loading: true,
  refresh: () => {},
});

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    return fetch("/api/site", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res?.success) setContent(res.data);
        return res?.data;
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SiteContentContext.Provider value={{ content, loading, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
}
