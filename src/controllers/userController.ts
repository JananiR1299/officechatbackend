import { Request, Response } from "express";
import Users from "../models/UserModel";
import Messages from "../models/MessageModel";
import Chats from "../models/ChatModel";
import Groups from "../models/GroupModel";
import Files from "../models/FileModel";

import GroupMembers from "../models/GroupMembers";
import { Op } from "sequelize";
import { updateUserActivity, getUserActivity } from "../routes/activityTracker";
import { getLoggedInUsers } from "../routes/userTracker";
import fs from "fs";
import path from "path";
import { error } from "console";
import Calls from "../models/CallModel";

// export const getSingleUserList = async (req: Request, res: Response) => {
//   console.log("callerid", req.params.callerId);
//   const userId = parseInt(req.params.callerId, 10);

//   try {
//     console.log("try", userId);
//     const user = await Users.findOne({ where: { UserID: userId } });
//     if (!user) {
//       return res.status(404).json({ error: `User not found: ${userId}` });
//     }
//     res.status(200).json({ callerdetail: user });
//   } catch (err: any) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching messages" });
//   }
// };
// export const getUserList = async (req: Request, res: Response) => {
//   console.log("/Users API check");
//   try {
//     // Step 1: Fetch unique SenderIDs from the Messages table
//     const messages = await Messages.findAll({
//       attributes: ["SenderID"],
//       group: ["SenderID"],
//     });

//     if (!messages || messages.length === 0) {
//       console.warn("No messages found.");
//       return res.status(404).json({ message: "No messages found." });
//     }

//     // Extract unique user IDs from the messages
//     const senderIDs = messages.map((message: any) => message.SenderID);

//     // If no SenderIDs found, return an empty array
//     if (senderIDs.length === 0) {
//       console.warn("No SenderIDs found.");
//       return res.status(200).json([]);
//     }

//     // Step 2: Fetch user details from the Users table
//     const users = await Users.findAll({
//       where: {
//         UserID: senderIDs,
//       },
//     });

//     // If no users found, return an empty array
//     if (!users || users.length === 0) {
//       console.warn("No users found.");
//       return res.status(404).json({ message: "No users found." });
//     }
//     // Step 3: Add active status to each user
//     const activeUserIDs = new Set(getLoggedInUsers());
//     const usersWithStatus = users.map((user) => ({
//       ...user.toJSON(), // Convert Sequelize model instance to plain object
//       isActive: activeUserIDs.has(user.UserID),
//     }));

//     res.json(usersWithStatus);
//   } catch (err: any) {
//     console.error("Error fetching users:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getUserList = async (req: Request, res: Response) => {
//   console.log("Logged in User ID:", req.params.loggedInUserId);

//   try {
//     const loggedInUserId = parseInt(req.params.loggedInUserId, 10);
//     console.log("", loggedInUserId);
//     // Step 1: Find all unique UserIDs from the Messages table
//     const messageSenders = await Messages.findAll({
//       attributes: ["SenderID"],
//       group: ["SenderID"],
//     });

//     const senderIDs = messageSenders.map((message) => message.SenderID);
//     console.log("senderIDs", senderIDs);
//     // Find all unique UserIDs from the Chats table (both User1ID and User2ID)
//     const chatParticipants = await Chats.findAll({
//       attributes: ["ChatID", "User1ID", "User2ID"],
//       where: {
//         [Op.or]: [
//           { User1ID: { [Op.in]: senderIDs } },
//           { User2ID: { [Op.in]: senderIDs } },
//         ],
//       },
//     });
//     console.log("Chat Participants:", chatParticipants);

//     // Create a set to store unique UserIDs
//     const userIDs = new Set<number>();

//     // Add User1ID and User2ID from chats to the set
//     chatParticipants.forEach((chat) => {
//       if (chat.User1ID) userIDs.add(chat.User1ID);
//       if (chat.User2ID) userIDs.add(chat.User2ID);
//     });
//     console.log("Unique User IDs:", Array.from(userIDs));

//     // Step 2: Fetch user details for these UserIDs
//     const users = await Users.findAll({
//       where: {
//         UserID: {
//           [Op.in]: [...userIDs],
//           [Op.ne]: loggedInUserId, // Exclude logged-in user
//         },
//       },
//     });
//     console.log("users", users);

//     if (users.length === 0) {
//       console.warn("No users found.");
//       return res.status(404).json({ message: "No users found." });
//     }

//     // Step 3: Add active status to each user
//     const activeUserIDs = new Set(getLoggedInUsers());
//     const usersWithStatus = await Promise.all(
//       users.map(async (user) => {
//         // Step 4: Fetch the last message for each chat involving the logged-in user and the current user
//         const lastMessage = await Messages.findOne({
//           where: {
//             ChatID: {
//               [Op.or]: [
//                 { User1ID: loggedInUserId, User2ID: user.UserID },
//                 { User1ID: user.UserID, User2ID: loggedInUserId },
//               ],
//             },
//           },
//           order: [["SentAt", "DESC"]],
//         });

//         return {
//           ...user.toJSON(), // Convert Sequelize model instance to plain object
//           isActive: activeUserIDs.has(user.UserID),
//           lastMessage: lastMessage ? lastMessage.Content : null, // Include last message text
//           lastMessageTime: lastMessage ? lastMessage.SentAt : null, // Include timestamp of last message
//         };
//       })
//     );

//     res.json(usersWithStatus);
//   } catch (err: any) {
//     console.error("Error fetching users:", err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const getUserList = async (req: Request, res: Response) => {
  console.log("Logged in User ID:", req.params.loggedInUserId);

  try {
    const loggedInUserId = parseInt(req.params.loggedInUserId, 10);

    // Step 1: Find all unique UserIDs from the Messages table
    const messageSenders = await Messages.findAll({
      attributes: ["SenderID"],
      group: ["SenderID"],
    });

    const senderIDs = messageSenders.map((message) => message.SenderID);

    // Find all unique UserIDs from the Chats table (both User1ID and User2ID)
    const chatParticipants = await Chats.findAll({
      attributes: ["User1ID", "User2ID"],
      where: {
        [Op.or]: [
          { User1ID: { [Op.in]: senderIDs } },
          { User2ID: { [Op.in]: senderIDs } },
        ],
      },
    });
    console.log("Chat Participants:", chatParticipants);

    // Create a set to store unique UserIDs
    const userIDs = new Set<number>();

    // Add User1ID and User2ID from chats to the set
    chatParticipants.forEach((chat) => {
      if (chat.User1ID) userIDs.add(chat.User1ID);
      if (chat.User2ID) userIDs.add(chat.User2ID);
    });
    console.log("Unique User IDs:", Array.from(userIDs));
    // Step 2: Fetch user details for these UserIDs
    const users = await Users.findAll({
      where: {
        UserID: {
          [Op.in]: [...userIDs],
          [Op.ne]: loggedInUserId, // Exclude logged-in user
        },
      },
    });
    console.log("users", users);
    if (users.length === 0) {
      console.warn("No users found.");
      return res.status(404).json({ message: "No users found." });
    }

    // Step 3: Add active status to each user
    const activeUserIDs = new Set(getLoggedInUsers());
    const usersWithStatus = users.map((user) => ({
      ...user.toJSON(), // Convert Sequelize model instance to plain object
      isActive: activeUserIDs.has(user.UserID),
    }));

    res.json(usersWithStatus);
  } catch (err: any) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getActiveUser = async (req: Request, res: Response) => {
  try {
    const activeUserIDs = await getLoggedInUsers();
    res.json(activeUserIDs);
  } catch (err: any) {
    console.log("Error in Get USer Active Status API");
  }
};
export const getMessageList = async (req: Request, res: Response) => {
  // console.log("req.body", req.query);
  try {
    const messageResult = await Messages.findAll({});
    res.json(messageResult);
  } catch (err: any) {
    console.log("err", err.Message);
    res.status(500).send("Internal Server Error");
  }
};

// export const getMessageListForSingle = async (req: Request, res: Response) => {
//   console.log("Request received");
//   console.log(`chatId: ${req.params.senderId}`);
//   const senderId = parseInt(req.params.senderId, 10);

//   try {
//     const messages = await Messages.findAll({
//       where: { SenderID: senderId },
//       order: [["SentAt", "ASC"]], // Optional: Order messages by creation date
//     });

//     if (messages.length === 0) {
//       return res
//         .status(404)
//         .json({ error: "No messages found for this ChatID" });
//     }

//     res.json(messages);
//   } catch (err: any) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching messages" });
//   }
// };

export const getMessageListForSingle = async (req: Request, res: Response) => {
  const userid = parseInt(req.params.senderId, 10);
  // const receiverid = parseInt(req.params.receiverId, 10);

  try {
    // Find all chat IDs where the user is either User1 or User2
    const chats = await Chats.findAll({
      where: {
        [Op.or]: [{ User1ID: userid }, { User2ID: userid }],
      },
    });

    // Create a map for quick access to chat data
    const chatMap = new Map<number, { User1ID: number; User2ID: number }>();
    chats.forEach((chat) =>
      chatMap.set(chat.ChatID, {
        User1ID: chat.User1ID,
        User2ID: chat.User2ID,
      })
    );

    // Extract ChatIDs from the chat records
    const chatIds = Array.from(chatMap.keys());
    console.log(chatIds);

    // Find all messages associated with these ChatIDs
    const messages = await Messages.findAll({
      where: {
        ChatID: {
          [Op.in]: chatIds,
        },
      },
      order: [["SentAt", "ASC"]],
    });

    console.log("sss", messages);
    // Map messages to include sender information
    const messagesWithSenderInfo = messages
      .map((message) => {
        const chat = chatMap.get(message.ChatID);
        if (chat) {
          return {
            ...message.toJSON(),
            SenderID: message.SenderID, // Preserve the original SenderID from the Messages table
          };
        }
        return null; // Skip if chat data is not found
      })
      .filter((message) => message !== null); // Remove any null values

    if (messagesWithSenderInfo.length === 0) {
      return res.status(404).json({ error: "No messages found for this user" });
    }

    res.json(messagesWithSenderInfo);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
};
// export const getMessageListForSingle = async (req: Request, res: Response) => {
//   const loggedInUserId = parseInt(req.params.senderId, 10); // Manju
//   const selectedUserId = parseInt(req.params.receiverid, 10); // Kalai (or another user)

//   try {
//     // Step 1: Find the chat between the two users (User1ID = Manju, User2ID = Kalai or vice versa)
//     const chat = await Chats.findOne({
//       where: {
//         [Op.or]: [
//           { User1ID: loggedInUserId, User2ID: selectedUserId },
//           { User1ID: selectedUserId, User2ID: loggedInUserId },
//         ],
//       },
//     });

//     if (!chat) {
//       return res.status(200).json([]);
//     }

//     // Step 2: Fetch all messages from that chat, ordered by SentAt (ascending)
//     const messages = await Messages.findAll({
//       where: {
//         ChatID: chat.ChatID,
//       },
//       order: [["SentAt", "ASC"]],
//     });

//     if (!messages.length) {
//       return res
//         .status(404)
//         .json({ message: "No messages found for this chat" });
//     }

//     // Step 3: Format the messages with sender information
//     const formattedMessages = messages.map((message) => ({
//       MessageId: message.MessageID,
//       ChatId: message.ChatID,
//       SenderId: message.SenderID,
//       Content: message.Content,
//       SentAt: message.SentAt,
//       isDeleted: message.IsDeleted,
//       isPinned: message.IsPinned,
//     }));

//     return res.status(200).json(formattedMessages);
//   } catch (err: any) {
//     console.error("Error fetching messages:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getGroupList = async (req: Request, res: Response) => {
  console.log("req.body", req.query);
  try {
    const groupResult = await Groups.findAll({
      order: [["CreatedAt", "DESC"]],
    });
    res.json(groupResult);
  } catch (err: any) {
    console.log("err", err.Message);
    res.status(500).send("Internal Server Error");
  }
};

export const getGroupMessagesList = async (req: Request, res: Response) => {
  console.log("Groupid: ", req.query.groupid);

  const groupId = req.query.groupid;
  console.log("Groupid: ", groupId);

  if (!groupId) {
    return res.status(400).json({ error: "Group ID is required" });
  }

  try {
    // Fetch all Chat IDs that belong to the given GroupID
    const chats = await Chats.findAll({
      attributes: ["ChatID"],
      where: {
        GroupID: groupId,
      },
    });
    console.log("chatIds", chats);
    // Extract Chat IDs
    const chatIds = chats.map((chat: any) => chat.ChatID);
    console.log("chatIds", chatIds);
    // Fetch messages for these Chat IDs
    const messages = await Messages.findAll({
      where: {
        ChatID: chatIds,
      },
      order: [["SentAt", "ASC"]], // Sort messages by timestamp
    });

    console.log("messages", messages);
    if (messages.length === 0) {
      return res
        .status(404)
        .json({ error: "There is No messages in this group." });
    }
    return res.json(messages);
  } catch (err: any) {
    console.error("Error fetching group messages:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGroupMembersWithUsernames = async (
  req: Request,
  res: Response
) => {
  console.log("Groupid: ", parseInt(req.params.groupId, 10));

  const groupId = parseInt(req.params.groupId, 10);
  try {
    // Fetch group members by groupId
    const groupMembers = await GroupMembers.findAll({
      where: { GroupID: groupId },
      attributes: ["GroupID", "UserID", "JoinedAt"],
    });

    // Fetch usernames for each userId
    const membersWithUsernames = await Promise.all(
      groupMembers.map(async (member) => {
        const user = await Users.findOne({
          where: { UserID: member.UserID },
          attributes: ["Username"],
        });

        return {
          GroupID: member.GroupID,
          UserID: member.UserID,
          JoinedAt: member.JoinedAt,
          Username: user ? user.Username : null,
        };
      })
    );
    console.log("membersWithUsernames", membersWithUsernames);
    return res.status(200).json(membersWithUsernames);
  } catch (error) {
    console.error("Error fetching group members with usernames:", error);
  }
};
export const deleteGroupMembers = async (req: Request, res: Response) => {
  const { groupId, userId } = req.params;
  console.log("delete", groupId, userId);
  try {
    // Delete the user from the group
    const result = await GroupMembers.destroy({
      where: {
        GroupID: groupId,
        UserID: userId,
      },
    });
    console.log("RESULT", result);
    if (result) {
      res.status(200).send({ message: "User removed from group" });
    } else {
      res.status(404).send({ message: "User not found in group" });
    }
  } catch (error) {
    console.error("Error removing user from group:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// export const createGroup = async (request: Request, response: Response) => {
//   console.log("Request body:", request.body);
//   const { GroupName, Username, CreatedBy, CreatedAt } = request.body;

//   try {
//     // Check if usernames are provided
//     if (!Username || !Array.isArray(Username) || Username.length === 0) {
//       return response.status(400).json({
//         error: "Usernames array is required and should not be empty.",
//       });
//     }

//     // Fetch user IDs based on provided usernames
//     const users = await Users.findAll({
//       where: {
//         Username: Username, // Ensure the column name matches your schema
//       },
//     });

//     console.log("Users fetched:", users);

//     // Create a map of usernames to user IDs
//     const userIDMap = new Map(
//       users.map((user) => [user.Username, user.UserID])
//     );

//     console.log("UserID Map:", userIDMap);

//     // Convert usernames to user IDs
//     const userIDs = Username.map((name) => userIDMap.get(name)).filter(
//       (id) => id !== undefined
//     );

//     console.log("User IDs:", userIDs);

//     // Check if all provided usernames are valid
//     if (userIDs.length !== Username.length) {
//       return response
//         .status(400)
//         .json({ error: "One or more usernames do not exist." });
//     }

//     // Create the group
//     const group = await Groups.create({
//       GroupName: GroupName,
//       CreatedBy: CreatedBy,
//       CreatedAt: CreatedAt,
//     });

//     console.log("Group created:", group);

//     // Add members to the group
//     const groupMembers = userIDs.map((UserID: number) => ({
//       GroupID: group.GroupID,
//       UserID,
//       JoinedAt: new Date(),
//     }));

//     console.log("Group members to be inserted:", groupMembers);
//     await GroupMembers.bulkCreate(groupMembers);

//     response.json(group);
//   } catch (error: any) {
//     console.error("Error creating group:", error.message);
//     response.status(500).json({ error: "Error creating group" });
//   }
// };

export const createGroup = async (request: Request, response: Response) => {
  console.log("Request body:", request.body);
  const { GroupName, Username, CreatedBy, CreatedAt } = request.body;

  try {
    if (!Username || !Array.isArray(Username) || Username.length === 0) {
      return response.status(400).json({
        error: "Usernames array is required and should not be empty.",
      });
    }

    const users = await Users.findAll({
      where: {
        Username: Username,
      },
    });

    console.log("Users fetched:", users);

    const userIDMap = new Map(
      users.map((user) => [user.Username, user.UserID])
    );

    console.log("UserID Map:", userIDMap);

    const userIDs = Username.map((name) => userIDMap.get(name)).filter(
      (id) => id !== undefined
    );

    // Ensure the CreatedBy user is also added to the group
    console.log("Initial User IDs:", userIDs);
    console.log("CreatedBy UserID:", CreatedBy);

    // Check if CreatedBy user ID is already in the array
    if (!userIDs.includes(CreatedBy)) {
      userIDs.push(CreatedBy);
    }

    console.log("Final User IDs after pushing CreatedBy:", userIDs);
    if (userIDs.length !== Username.length && !userIDs.includes(CreatedBy)) {
      return response
        .status(400)
        .json({ error: "One or more usernames do not exist." });
    }

    const group = await Groups.create({
      GroupName: GroupName,
      CreatedBy: CreatedBy,
      CreatedAt: CreatedAt,
    });

    console.log("Group created:", group);

    const groupMembers = userIDs.map((UserID: number) => ({
      GroupID: group.GroupID,
      UserID,
      JoinedAt: new Date(),
    }));

    console.log("Group members to be inserted:", groupMembers);
    await GroupMembers.bulkCreate(groupMembers);

    response.json(group);
  } catch (error: any) {
    console.error("Error creating group:", error.message);
    response.status(500).json({ error: "Error creating group" });
  }
};

export const addUsersToGroup = async (request: Request, response: Response) => {
  const { GroupID, Usernames } = request.body;
  console.log("Usernames", Usernames);

  try {
    // Check if GroupID and Usernames are provided
    if (!GroupID || !Usernames || !Array.isArray(Usernames)) {
      return response.status(400).json({ error: "Invalid input data" });
    }
    // Array to hold the inserted group members
    const insertedMembers: {
      GroupID: number;
      UserID: number;
      Username: string;
    }[] = [];
    // Iterate over the array of usernames
    for (const username of Usernames) {
      // Check if the user exists
      const user = await Users.findOne({ where: { Username: username } });
      if (!user) {
        return response
          .status(404)
          .json({ error: `User not found: ${username}` });
      }

      // Check if the user is already a member of the group
      const existingMember = await GroupMembers.findOne({
        where: {
          GroupID: GroupID,
          UserID: user.dataValues.UserID,
        },
      });

      if (existingMember) {
        console.log(`User ${username} is already a member of this group.`);
        // continue; // Skip to the next username
      }

      // Add the user to the group
      await GroupMembers.create({
        GroupID: GroupID,
        UserID: user.dataValues.UserID,
        JoinedAt: new Date(),
      });

      // Collect the inserted member details
      insertedMembers.push({
        GroupID: GroupID,
        UserID: user.dataValues.UserID,
        Username: user.dataValues.Username,
      });
    }
    const updatedGroup = await Groups.findOne({ where: { GroupID: GroupID } });
    console.log("/adduser success");
    return response.status(200).json({
      message: "Users added to group successfully",
      insertedMembers: insertedMembers,
      group: updatedGroup, // Include updated group details
    });
  } catch (error: any) {
    console.error("Error adding users to group:", error);
    // Handle unique constraint error specifically
    if (error.name === "SequelizeUniqueConstraintError") {
      return response
        .status(400)
        .json({ error: "Some users might already be members of this group." });
    }
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

// Endpoint to get username suggestions based on input
export const getUsernameSuggestions = async (
  request: Request,
  response: Response
) => {
  const { query } = request.query;

  try {
    if (!query || typeof query !== "string") {
      return response.status(400).json({ error: "Invalid query parameter" });
    }

    // Search for users where username matches the query
    const users = await Users.findAll({
      where: {
        UserName: {
          [Op.like]: `%${query}%`, // Case-insensitive partial match
        },
      },
      attributes: ["UserID", "Username"], // Return only the UserName attribute
    });

    // Extract usernames from the result
    const userResults = users.map((user) => ({
      UserID: user.UserID,
      Username: user.Username,
    }));

    // Send the result to the frontend
    response.json(userResults);
  } catch (error) {
    response.status(500).json({ error: "Error fetching suggestions" });
  }
};

// export const getUserStatus = async (request: Request, response: Response) => {
//   try {
//     const users = await Users.findAll({
//       attributes: ["UserID", "Username", "Status"],
//     });
//     console.log("Status", users);
//     response.json(users);
//   } catch (error: any) {
//     response.status(500).json({ error: error.message });
//   }
// };

// Endpoint to update user activity status
// export const updateStatus = async (req: Request, res: Response) => {
//   const { userId, isActive } = req.body;

//   try {
//     updateUserActivity(userId, isActive);
//     res.status(200).json({ message: "Status updated" });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating status" });
//   }
// };

// Endpoint to get user activity status
export const getUserStatus = async (req: Request, res: Response) => {
  console.log("getuserSattus", req.params.userId);
  const userId = parseInt(req.params.userId, 10);

  try {
    const status = getUserActivity(userId);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving status" });
  }
};

export const uploadFileContent = async (req: Request, res: Response) => {
  // console.log("uploadFileContent");
  // const { fileBlob, filename, MessageID, filetype, filesize } = req.body;
  // console.log(filename);
  // if (!fileBlob || !filename) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Content and Filename are required" });
  // }
  // try {
  //   const FileContent = Buffer.from(fileBlob, "base64");
  //   const publicDirectory = path.join(__dirname, "../../public");
  //   // Ensure the directory exists
  //   if (!fs.existsSync(publicDirectory)) {
  //     fs.mkdirSync(publicDirectory, { recursive: true });
  //   }
  //   // Define file path
  //   const filePath = path.join(publicDirectory, filename);
  //   console.log("filePath", filePath);
  //   // Save file content to a file
  //   fs.writeFileSync(filePath, FileContent);
  //   // Save file info to database
  //   const files = await Files.create({
  //     MessageID: MessageID,
  //     FileName: filename,
  //     FileType: filetype, // Store MIME type
  //     FileSize: filesize,
  //     FileContent: fs.readFileSync(filePath), // Read file content
  //   });
  //   res.status(200).json({
  //     success: true,
  //     resultData: {
  //       files: files,
  //       message: "File content uploaded and saved successfully",
  //     },
  //   });
  // } catch (error) {
  //   console.error("Error uploading file content:", error);
  //   res
  //     .status(500)
  //     .json({ success: false, message: "Error uploading file content" });
  // }
};

export const getUploadFile = async (req: Request, res: Response) => {
  console.log("Request received");
  console.log(`chatId: ${req.params.senderId}`);
  const senderId = parseInt(req.params.senderId, 10);

  try {
    const messages = await Messages.findAll({
      where: { SenderID: senderId },
      order: [["SentAt", "ASC"]], // Optional: Order messages by creation date
    });

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ error: "No messages found for this ChatID" });
    }

    res.json(messages);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
};

export const postCall = async (req: Request, res: Response) => {
  const {
    CallerID,
    ReceiverID,
    GroupID,
    StartTime,
    EndTime,
    CallType,
    ScreenShared,
  } = req.body;

  try {
    const newCall = await Calls.create({
      CallerID,
      ReceiverID,
      GroupID,
      StartTime,
      EndTime,
      CallType,
      ScreenShared,
    });

    res.status(201).json(newCall);
  } catch (err: any) {
    console.error("Error storing call data:", err);
    res.status(500).json({ error: "Failed to store call data" });
  }
};

// export const getCallById = async (req: Request, res: Response) => {
//   const callId = parseInt(req.params.callId, 10);

//   try {
//     const call = await Calls.findOne({
//       where: { CallID: callId },
//     });

//     if (!call) {
//       return res.status(404).json({ error: 'Call not found' });
//     }

//     res.json(call);
//   } catch (err: any) {
//     console.error('Error fetching call data:', err);
//     res.status(500).json({ error: 'Failed to fetch call data' });
//   }
// };
