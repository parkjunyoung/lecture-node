module.exports = function(sequelize, DataTypes){
    var Products = sequelize.define('Products',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            product_name : { type: DataTypes.STRING(1200) },
            thumbnail : { type: DataTypes.STRING(1200) },
            price : { type: DataTypes.INTEGER },
            sale_price : { type: DataTypes.INTEGER },
            description : { type: DataTypes.TEXT }
        }
    );
    return Products;
}