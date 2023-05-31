import { useEffect, useState } from "react";

import { loadUsers } from "../utils";

export type UserDict = Record<string, string>;

export const useRegisteredUsers = () => {
  const [users, setUsers] = useState<UserDict>();

  // initially load users
  useEffect(() => {
    loadUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return users;
};
