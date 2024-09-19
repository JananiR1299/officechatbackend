import { Model, DataTypes } from "sequelize";
import sequelize from "./dbconfig"; // Ensure correct import path

class Groups extends Model {
  public GroupID!: number;
  public GroupName!: string;
  public CreatedBy!: number;
  public CreatedAt!: Date;
}

Groups.init(
  {
    GroupID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    GroupName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OFCGroups",
    tableName: "OFCGroups",
    timestamps: false,
  }
);

export default Groups;
