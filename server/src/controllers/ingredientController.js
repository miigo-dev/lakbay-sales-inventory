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
            req.body.type_id,
            req.body.ingredient_quantity,
            req.body.ingredient_unit,
            req.body.ingredient_price,
            req.body.supplier_id,
            req.body.reorder_level,
            req.body.ingredient_status
        );
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientService.updateIngredient(
            req.body.ingredient_name,
            req.body.type_id,
            req.body.ingredient_quantity,
            req.body.ingredient_unit,
            req.body.ingredient_price,
            req.body.supplier_id,
            req.body.reorder_level,
            req.body.ingredient_status,
            req.params.id
        );
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