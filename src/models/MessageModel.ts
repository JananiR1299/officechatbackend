import { DataTypes, Model } from "sequelize";
import sequelize from "./dbconfig";

class Messages extends Model {
  public MessageID!: number;
  public ChatID!: number;
  public SenderID!: number;
  public Content!: string;
  public SentAt!: Date;
  public IsDeleted!: boolean;
  public IsPinned!: boolean;
}

Messages.init(
  {
    MessageID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ChatID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Chats",
        key: "ChatID",
      },
    },
    SenderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "UserID",
      },
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    SentAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    IsPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "OFCMessages",
    tableName: "OFCMessages",
    timestamps: false,
  }
);

export default Messages;
