// server/userTracker.ts
var loggedInUsers: any = [];

export const addUser = (userId: number) => {
  loggedInUsers.push(userId);
  console.log("add userloggedInUsers", loggedInUsers);
};

export const removeUser = (userId: number) => {
  console.log("remove ", userId);
  loggedInUsers = loggedInUsers.filter((item: number) => item !== userId);
  // console.log(loggedInUsers);
  // loggedInUsers.pop(loggedInUsers);
  console.log("removed userloggedInUsers", loggedInUsers);
};

export const getLoggedInUsers = () => {
  console.log("loggedInUsers", loggedInUsers);
  return loggedInUsers;
};
