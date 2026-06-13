import { useEffect, useState } from 'react';
import { DEFAULT_HOMEPAGE_CONFIG, type HomepageConfig } from '~/data/homepage';
import { fetchPublicSettings } from '~/utils/api/settings';

export function useHomepage() {
  const [homepage, setHomepage] = useState<HomepageConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicSettings()
      .then((data) => {
        if (data.homepage) {
          setHomepage({
            banners: data.homepage.banners ?? [],
            features: data.homepage.features?.length
              ? data.homepage.features
              : DEFAULT_HOMEPAGE_CONFIG.features,
            featuredProductIds: data.homepage.featuredProductIds ?? [],
          });
        }
      })
      .catch(() => {
        // fallback to defaults
      })
      .finally(() => setLoading(false));
  }, []);

  return { homepage, loading };
}
