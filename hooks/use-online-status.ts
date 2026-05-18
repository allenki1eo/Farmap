import { useEffect, useState } from "react";
import { offlineService } from "@/services/offline";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const online = await offlineService.isOnline();
      if (mounted) setIsOnline(online);
    }
    check();
    const timer = setInterval(check, 8000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return isOnline;
}
