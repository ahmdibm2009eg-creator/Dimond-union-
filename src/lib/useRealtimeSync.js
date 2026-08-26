import { useEffect } from 'react';
import { onSync } from '@/api/base44Client';

/**
 * Subscribe to Supabase real-time changes.
 * Pass a callback that re-fetches data (e.g. loadProjects, loadOverrides).
 */
export function useRealtimeSync(onChange) {
  useEffect(() => {
    return onSync(onChange);
  }, [onChange]);
}
