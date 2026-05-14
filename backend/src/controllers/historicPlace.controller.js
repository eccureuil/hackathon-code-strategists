import HistoricPlace from "../models/HistoricPlace.js";

// CREATE
export const createHistoricPlace = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      description,
      aiDescription,
      history,
      location,
      address,
      tags,
      featured
    } = req.body;

    // 📸 images uploadées par multer
    const photos = req.files
      ? req.files.map((file) => file.path || file.filename)
      : [];

    // 📍 location JSON parse (important)
    const parsedLocation =
      typeof location === "string"
        ? JSON.parse(location)
        : location;

    const place = new HistoricPlace({
      name,
      slug,
      category,
      description,
      aiDescription,
      history,
      photos,
      location: parsedLocation,
      address,
      tags: tags ? JSON.parse(tags) : [],
      featured,
    });

    const saved = await place.save();

    res.status(201).json(saved);

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL
export const getAllHistoricPlaces = async (req, res) => {
  try {
    const places = await HistoricPlace.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET FEATURED
export const getFeaturedPlaces = async (req, res) => {
  try {
    const places = await HistoricPlace.find({ featured: true });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
export const getHistoricPlaceById = async (req, res) => {
  try {
    const place = await HistoricPlace.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Lieu non trouvé" });
    }

    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔎 GET BY SLUG (utile pour frontend SEO)
export const getHistoricPlaceBySlug = async (req, res) => {
  try {
    const place = await HistoricPlace.findOne({ slug: req.params.slug });

    if (!place) {
      return res.status(404).json({ message: "Lieu non trouvé" });
    }

    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateHistoricPlace = async (req, res) => {
  try {
    const {
      name,
      slug,
      category,
      description,
      aiDescription,
      history,
      location,
      address,
      tags,
      featured
    } = req.body;

    const photos = req.files
      ? req.files.map((file) => file.path || file.filename)
      : undefined;

    const parsedLocation =
      typeof location === "string"
        ? JSON.parse(location)
        : location;

    const updateData = {
      name,
      slug,
      category,
      description,
      aiDescription,
      history,
      location: parsedLocation,
      address,
      tags: tags ? JSON.parse(tags) : [],
      featured,
    };

    // 📸 only overwrite if new images uploaded
    if (photos) updateData.photos = photos;

    const place = await HistoricPlace.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!place) {
      return res.status(404).json({ message: "Lieu non trouvé" });
    }

    res.status(200).json(place);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteHistoricPlace = async (req, res) => {
  try {
    const place = await HistoricPlace.findByIdAndDelete(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Lieu non trouvé" });
    }

    res.status(200).json({ message: "Supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GEO: FIND NEARBY (IMPORTANT POUR LELEAFLET)
export const getNearbyPlaces = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        message: "lng et lat requis"
      });
    }

    const places = await HistoricPlace.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};