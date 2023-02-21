export const loadUsers = async (host: string) => {
  const response = await fetch(`https://${host}/.well-known/nostr.json`);
  const data = await response.json();
  const users = data.names;
  return users;
};
