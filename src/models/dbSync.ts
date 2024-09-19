import sequelize from "./dbconfig"; // Adjust the import path if needed

const syncDatabase = async () => {
  console.log("Sync check");
  try {
    await sequelize.authenticate(); // Check if the connection can be established
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
};

export default syncDatabase;
