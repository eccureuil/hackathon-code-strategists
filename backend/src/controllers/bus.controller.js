import BusLine from "../models/BusLine.js";
import Stop from "../models/Stop.js";

// @desc    Créer une ligne de bus
export const createBusLine = async (req, res) => {
  try {
    const { lineName, forwardStops, forwardTimes, hasReturnTrip, returnStops, returnTimes, isActive } = req.body;

    const existingLine = await BusLine.findOne({ lineName });
    if (existingLine) {
      return res.status(400).json({ success: false, message: "Cette ligne existe déjà" });
    }

    // Vérifier/créer les arrêts
    const getStopIds = async (stopNames) => {
      const ids = [];
      for (const name of stopNames) {
        let stop = await Stop.findOne({ name });
        if (!stop) {
          return res.status(400).json({ success: false, message: `L'arrêt "${name}" n'existe pas. Créez-le d'abord.` });
        }
        ids.push(stop._id);
      }
      return ids;
    };

    const forwardStopIds = await getStopIds(forwardStops);
    
    let busLineData = {
      lineName,
      forwardStops: forwardStopIds,
      forwardTimes,
      isActive: isActive !== undefined ? isActive : true,
    };

    if (hasReturnTrip && returnStops && returnStops.length > 0) {
      const returnStopIds = await getStopIds(returnStops);
      busLineData.hasReturnTrip = true;
      busLineData.returnStops = returnStopIds;
      busLineData.returnTimes = returnTimes;
    }

    const busLine = await BusLine.create(busLineData);
    const populatedLine = await busLine.populate(["forwardStops", "returnStops"]);

    res.status(201).json({ success: true, data: populatedLine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir toutes les lignes
export const getAllBusLines = async (req, res) => {
  try {
    const lines = await BusLine.find()
      .populate("forwardStops")
      .populate("returnStops")
      .sort({ lineName: 1 });
    res.status(200).json({ success: true, data: lines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Obtenir une ligne par ID
export const getBusLineById = async (req, res) => {
  try {
    const line = await BusLine.findById(req.params.id)
      .populate("forwardStops")
      .populate("returnStops");
    if (!line) {
      return res.status(404).json({ success: false, message: "Ligne non trouvée" });
    }
    res.status(200).json({ success: true, data: line });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rechercher un trajet (avec sens)
export const searchRoute = async (req, res) => {
  try {
    const { departure, destination, lineId } = req.body;

    if (!departure || !destination) {
      return res.status(400).json({ success: false, message: "Départ et destination requis" });
    }

    const lines = await BusLine.find(lineId ? { _id: lineId, isActive: true } : { isActive: true })
      .populate("forwardStops")
      .populate("returnStops");

    const results = [];

    for (const line of lines) {
      // Vérifier dans le sens aller
      const forwardStopNames = line.forwardStops.map(s => s.name);
      const depIndexForward = forwardStopNames.indexOf(departure);
      const destIndexForward = forwardStopNames.indexOf(destination);
      
      if (depIndexForward !== -1 && destIndexForward !== -1 && depIndexForward < destIndexForward) {
        let totalTime = 0;
        for (let i = depIndexForward; i < destIndexForward; i++) {
          totalTime += line.forwardTimes[i];
        }
        results.push({
          lineId: line._id,
          lineName: line.lineName,
          direction: "aller",
          departure,
          destination,
          stops: forwardStopNames.slice(depIndexForward, destIndexForward + 1),
          totalTime,
        });
      }

      // Vérifier dans le sens retour
      if (line.hasReturnTrip && line.returnStops && line.returnStops.length > 0) {
        const returnStopNames = line.returnStops.map(s => s.name);
        const depIndexReturn = returnStopNames.indexOf(departure);
        const destIndexReturn = returnStopNames.indexOf(destination);
        
        if (depIndexReturn !== -1 && destIndexReturn !== -1 && depIndexReturn < destIndexReturn) {
          let totalTime = 0;
          for (let i = depIndexReturn; i < destIndexReturn; i++) {
            totalTime += line.returnTimes[i];
          }
          results.push({
            lineId: line._id,
            lineName: line.lineName,
            direction: "retour",
            departure,
            destination,
            stops: returnStopNames.slice(depIndexReturn, destIndexReturn + 1),
            totalTime,
          });
        }
      }
    }

    results.sort((a, b) => a.totalTime - b.totalTime);

    res.status(200).json({
      success: true,
      data: {
        buses: results,
        fastest: results.length > 0 ? results[0] : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rechercher une ligne par nom
export const searchBusLine = async (req, res) => {
  try {
    const { q } = req.query;
    const query = q && q.trim() ? { lineName: { $regex: q, $options: "i" } } : {};
    const lines = await BusLine.find(query)
      .populate("forwardStops")
      .populate("returnStops")
      .limit(20);
    res.status(200).json({ success: true, data: lines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour une ligne
export const updateBusLine = async (req, res) => {
  try {
    const { lineName, forwardStops, forwardTimes, hasReturnTrip, returnStops, returnTimes, isActive } = req.body;
    const line = await BusLine.findById(req.params.id);
    if (!line) {
      return res.status(404).json({ success: false, message: "Ligne non trouvée" });
    }

    const getStopIds = async (stopNames) => {
      const ids = [];
      for (const name of stopNames) {
        const stop = await Stop.findOne({ name });
        if (!stop) return null;
        ids.push(stop._id);
      }
      return ids;
    };

    if (lineName) line.lineName = lineName;
    if (forwardStops) {
      const ids = await getStopIds(forwardStops);
      if (!ids) return res.status(400).json({ success: false, message: "Un arrêt n'existe pas" });
      line.forwardStops = ids;
    }
    if (forwardTimes) line.forwardTimes = forwardTimes;
    if (hasReturnTrip !== undefined) line.hasReturnTrip = hasReturnTrip;
    if (returnStops && hasReturnTrip) {
      const ids = await getStopIds(returnStops);
      if (!ids) return res.status(400).json({ success: false, message: "Un arrêt retour n'existe pas" });
      line.returnStops = ids;
    }
    if (returnTimes && hasReturnTrip) line.returnTimes = returnTimes;
    if (isActive !== undefined) line.isActive = isActive;

    await line.save();
    const populatedLine = await line.populate(["forwardStops", "returnStops"]);
    res.status(200).json({ success: true, data: populatedLine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supprimer une ligne
export const deleteBusLine = async (req, res) => {
  try {
    const line = await BusLine.findById(req.params.id);
    if (!line) {
      return res.status(404).json({ success: false, message: "Ligne non trouvée" });
    }
    await line.deleteOne();
    res.status(200).json({ success: true, message: "Ligne supprimée" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtenir toutes les lignes (simple)
export const getAllLinesSimple = async (req, res) => {
  try {
    const lines = await BusLine.find({ isActive: true }).select("lineName _id").sort({ lineName: 1 });
    res.status(200).json({ success: true, data: lines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtenir les détails d'une ligne avec coordonnées
export const getBusLineDetails = async (req, res) => {
  try {
    const line = await BusLine.findById(req.params.id)
      .populate("forwardStops")
      .populate("returnStops");
    if (!line) {
      return res.status(404).json({ success: false, message: "Ligne non trouvée" });
    }
    res.status(200).json({ success: true, data: line });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exportData = async (req, res) => {
  try {
    const stops = await Stop.find();
    const lines = await BusLine.find().populate("forwardStops").populate("returnStops");
    res.status(200).json({
      success: true,
      data: { stops, lines }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const importData = async (req, res) => {
  try {
    const { stops, lines } = req.body;
    if (stops) {
      for (const stop of stops) {
        await Stop.findOneAndUpdate({ name: stop.name }, stop, { upsert: true });
      }
    }
    if (lines) {
      for (const line of lines) {
        await BusLine.findOneAndUpdate({ lineName: line.lineName }, line, { upsert: true });
      }
    }
    res.status(200).json({ success: true, message: "Import réussi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};