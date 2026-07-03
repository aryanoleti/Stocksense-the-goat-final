"use client";

import { useEffect, useState } from "react";

/** NSE regular session: Mon-Fri, 9:15am-3:30pm IST. Doesn't account for exchange holidays. */
export function useMarketStatus() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    function check() {
      const ist = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const day = ist.getDay(); // 0 Sun - 6 Sat
      const minutes = ist.getHours() * 60 + ist.getMinutes();
      const isWeekday = day >= 1 && day <= 5;
      const isSessionTime = minutes >= 9 * 60 + 15 && minutes <= 15 * 60 + 30;
      setOpen(isWeekday && isSessionTime);
    }
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, []);

  return open;
}
