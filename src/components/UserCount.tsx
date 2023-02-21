import { useEffect, useState } from "react";
import { loadUsers } from "../utils";

type UserCountProps = {
  host: string;
};

const updateInterval = 30_000;

export const UserCount = ({ host }: UserCountProps) => {
  const [userCount, setUserCount] = useState<boolean | number>(false);

  const updateUserCount = (users: Record<string, string>) => {
    console.info("updating user count");
    const userCount = Object.keys(users).length;
    setUserCount(userCount);
  };

  useEffect(() => {
    loadUsers(host).then(updateUserCount);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadUsers(host).then(updateUserCount);
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
