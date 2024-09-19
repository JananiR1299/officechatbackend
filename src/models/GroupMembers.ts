import { Model, DataTypes } from "sequelize";
import sequelize from "./dbconfig"; // Ensure correct import path
import Groups from "./GroupModel";
import Users from "./UserModel";

class GroupMembers extends Model {
  public GroupID!: number;
  public UserID!: number;
  public JoinedAt!: Date;
}

GroupMembers.init(
  {
    GroupID: {
      type: DataTypes.INTEGER,
      // Primary key in this table
      references: {
        model: Groups, // Reference the Group model
        key: "GroupID", // Key in the Groups table
      },
      primaryKey: true, // Mark this as part of the primary key
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // Primary key in this table
      references: {
        model: Users, // Reference the Group model
        key: "UserID", // Key in the Groups tabl2e
      },
      primaryKey: true, // Mark this as part of the primary key
    },
    JoinedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "OFCGroupMembers",
    tableName: "OFCGroupMembers",
    timestamps: false,
  }
);

export default GroupMembers;
