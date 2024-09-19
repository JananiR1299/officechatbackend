import { DataTypes, Model } from "sequelize";
import sequelize from "./dbconfig";

class Chats extends Model {
  public ChatID!: number;
  public User1ID!: number;
  public User2ID!: number;
  public GroupID!: number;
  public CreatedAt!: Date;
}

Chats.init(
  {
    ChatID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    User1ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "UserID",
      },
    },
    User2ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "UserID",
      },
    },
    GroupID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Groups",
        key: "GroupID",
      },
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OFCChats",
    tableName: "OFCChats",
    timestamps: false,
  }
);

export default Chats;
