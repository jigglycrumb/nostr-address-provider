import { useEffect, useState } from "react";
import { loadUsers } from "../utils";

const updateInterval = 30_000;

export const UserCount = () => {
  const [userCount, setUserCount] = useState<boolean | number>(false);

  const updateUserCount = (users: Record<string, string>) => {
    const userCount = Object.keys(users).length;
    setUserCount(userCount);
  };

  useEffect(() => {
    loadUsers().then(updateUserCount);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadUsers().then(updateUserCount);
    }, updateInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="box user-count">
      {!userCount ? (
        <strong>Loading…</strong>
      ) : (
        <div>
          <strong>Total users verified: {userCount}</strong> 🎉
        </div>
      )}
    </section>
  );
};
