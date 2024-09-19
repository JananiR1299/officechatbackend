import { DataTypes, Model } from "sequelize";
import sequelize from "./dbconfig";

class Files extends Model {
  public FileID!: number;
  public MessageID!: number;
  public FileName!: string;
  public FileType!: string;
  public FileSize!: number;
  public FileContent!: string;
  public UploadedAt!: Date;
}

Files.init(
  {
    FileID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    MessageID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Messages",
        key: "MessageID",
      },
    },
    FileName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    FileType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    FileSize: {
      type: DataTypes.INTEGER,
      autoIncrement: false,
    },
    FileContent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    UploadedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "OFCFiles",
    tableName: "OFCFiles",
    timestamps: false,
  }
);

export default Files;
