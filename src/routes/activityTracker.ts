// In-memory storage to track user activity
const userActivityMap: Map<number, { isActive: boolean }> = new Map();

// Update user activity status
export const updateUserActivity = (userId: number, isActive: boolean) => {
  userActivityMap.set(userId, { isActive });
};

// Get user activity status
export const getUserActivity = (userId: number) => {
  return userActivityMap.get(userId) || { isActive: false };
};
