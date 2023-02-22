export const loadUsers = async () => {
  const response = await fetch(`/.well-known/nostr.json`);
  const data = await response.json();
  const users = data.names;
  return users;
};
