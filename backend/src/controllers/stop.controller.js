import Stop from "../models/Stop.js";
import BusLine from "../models/BusLine.js";

// @desc    Créer un arrêt
// @route   POST /api/bus/stops
// @access  Private (Admin)
export const createStop = async (req, res) => {
  try {
    const { name, coordinates } = req.body;

    if (!name || !coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).json({
        success: false,
        message: "Nom, latitude et longitude sont requis",
      });
    }

    const existingStop = await Stop.findOne({ name });
    if (existingStop) {
      return res.status(400).json({
        success: false,
        message: "Cet arrêt existe déjà",
      });
    }

    const stop = await Stop.create({
      name,
      coordinates,
    });

    res.status(201).json({
      success: true,
      data: stop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Obtenir tous les arrêts
// @route   GET /api/bus/stops
// @access  Public
export const getAllStops = async (req, res) => {
  try {
    const stops = await Stop.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: stops,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mettre à jour un arrêt
// @route   PUT /api/bus/stops/:id
// @access  Private (Admin)
export const updateStop = async (req, res) => {
  try {
    const { name, coordinates } = req.body;
    const stop = await Stop.findById(req.params.id);

    if (!stop) {
      return res.status(404).json({
        success: false,
        message: "Arrêt non trouvé",
      });
    }

    if (name) stop.name = name;
    if (coordinates) stop.coordinates = coordinates;

    await stop.save();

    res.status(200).json({
      success: true,
      data: stop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Supprimer un arrêt
// @route   DELETE /api/bus/stops/:id
// @access  Private (Admin)
export const deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);

    if (!stop) {
      return res.status(404).json({
        success: false,
        message: "Arrêt non trouvé",
      });
    }

    // Vérifier si l'arrêt est utilisé par une ligne
    const usedInLine = await BusLine.findOne({ stops: stop._id });

    if (usedInLine) {
      return res.status(400).json({
        success: false,
        message: "Cet arrêt est utilisé par une ligne, supprimez la ligne d'abord",
      });
    }

    await stop.deleteOne();

    res.status(200).json({
      success: true,
      message: "Arrêt supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};