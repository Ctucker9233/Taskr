// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var Organization = sequelize.define("Organization", {
    // The email cannot be null, and must be a proper email before creation
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    address1: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    address2: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    zipcode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  // Creating a custom method for our Organization model. This will check if an unhashed password entered by the organization can be compared to the hashed password stored in our database
  Organization.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the Organization Model lifecycle
  // In this case, before an Organization is created, we will automatically hash their password
  Organization.addHook("beforeCreate", function(organization) {
    organization.password = bcrypt.hashSync(organization.password, bcrypt.genSaltSync(10), null);
  });

  Organization.associate = function(models) {
    Organization.hasMany(models.User, {
      name: "organizationId",
      type: sequelize.INTEGER,
      onDelete: "cascade"
    });
  };
  return Organization;
};
