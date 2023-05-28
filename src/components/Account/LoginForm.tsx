import type { Event as NostrEvent } from "nostr-tools";
import { signEvent } from "../../utils";

export type UserData = {
  lightningAddress: string;
  pubkey: string;
  registeredAt: string;
  username: string;
};

type UserDataResponse = {
  success: boolean;
  data: UserData;
};

type LoginFormProps = {
  onLogin: (response: UserDataResponse) => void;
};

const USER_READ_API_URL = "/api/user-read";

const loginUser = async (signedEvent: NostrEvent) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signedEvent }),
  };
  const response = await fetch(USER_READ_API_URL, options);
  const json = await response.json();
  return json;
};

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const handleClick = async () => {
    const signedEvent = await signEvent();
    if (signedEvent) {
      const userDataResponse = await loginUser(signedEvent);
      onLogin(userDataResponse);
    }
  };

  return (
    <section className="box">
      <strong>Welcome back, nostrich!</strong>
      <p>Login with a NIP-07 compatible browser extension.</p>
      <button onClick={handleClick}>Login</button>
    </section>
  );
};
