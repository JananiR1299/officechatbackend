import { Model, DataTypes } from "sequelize";
import sequelize from "./dbconfig"; // Ensure correct import path

class Users extends Model {
  public UserID!: number;
  public Username!: string;
  public Email!: string;
  public PasswordHash!: string;
  public FirstName!: string;
  public LastName!: string;
  public ProfilePicture!: Blob;
  public Status!: string;
  public LastSeen!: Date;
  public IsMaster!: Boolean;
}

Users.init(
  {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PasswordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ProfilePicture: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastSeen: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    IsMaster: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "OFCUsers",
    tableName: "OFCUsers",
    timestamps: false,
  }
);

export default Users;
