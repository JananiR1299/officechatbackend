import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./dbconfig";

class Calls extends Model {
  public CallID!: number;
  public CallerID!: number;
  public ReceiverID!: number;
  public GroupID!: number | null;
  public StartTime!: Date;
  public EndTime!: Date | null;
  public CallType!: string;
  public ScreenShared!: boolean;
}

Calls.init(
  {
    CallID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CallerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "UserID",
      },
    },
    ReceiverID: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    StartTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    EndTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CallType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ScreenShared: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OFCCalls",
    tableName: "OFCCalls",
    timestamps: false,
  }
);

export default Calls;
