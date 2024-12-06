const ingredientService = require('../services/ingredientService');

exports.getAllIngredients = async (req, res) => {
    try {
        const ingredients = await ingredientService.getAllIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getIngredientByID = async (req, res) => {
    try {
        const ingredient = await ingredientService.getIngredientByID(req.params.id);
        res.status(200).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.addIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientService.addIngredient(
            req.body.ingredient_name,
            req.body.ingredient_quantity,
            req.body.ingredient_unit,
            req.body.ingredient_price,
            req.body.reorder_level,
            req.body.type_id,
            req.body.warehouse_id
        );
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateIngredient = async (req, res) => {
    try {
        const { id } = req.params;
        const { ingredient_name, ingredient_price } = req.body;
        const ingredient = await ingredientService.updateIngredient(id, ingredient_name, ingredient_price);
        res.status(200).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientService.deleteIngredient(req.params.id);
        res.status(200).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getIngredientByWarehouse = async (req, res) => {
    try {
        const ingredients = await ingredientService.getIngredientByWarehouse(req.params.warehouse_id);
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.addIngredientType = async (req, res) => {
    try {
        const ingredientType = await ingredientService.addIngredientType(req.body.type_name);
        res.status(201).json(ingredientType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAllIngredientTypes = async (req, res) => {
    try {
        const types = await ingredientService.getAllIngredientTypes();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}