export const fetchUser = () => {
  const userInfo = localStorage.getItem("connect-user");
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return null; // Return null when user is not logged in
};
