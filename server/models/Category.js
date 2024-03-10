const db = require('../db/index');

class Category {
    /**
     * Get all categories
     * 
     * @param  {null}
     * @return {Object|null} An object of categories
     */
    async find() {
        try {
            // pg query statement
            const statement = `SELECT * FROM categories`;

            // query database
            const result = await db.query(statement);

            if (result.rows.length > 0) {
                return result.rows;
            }

            return null;
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports = new Category();