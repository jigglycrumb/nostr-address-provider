import type { UserDict } from "../hooks";

export const checkUsername = (username: string, users?: UserDict) => {
  if (!users) return false;

  if (username.length === 0) {
    return false;
  }

  const usernameFormat = /^[0-9a-z-_\.]{1,64}$/g;
  const isUsernameValid = usernameFormat.test(username);

  if (!isUsernameValid) {
    return "The username can only contain lowercase letters, numbers, _, - and .";
  } else if (users[username]) {
    return "Sorry, this username is already taken.";
  } else {
    return false;
  }
};
