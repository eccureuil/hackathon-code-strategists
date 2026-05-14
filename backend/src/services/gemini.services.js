import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// helper safe JSON parse
const safeJSONParse = (text, fallback = null) => {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : fallback;
  } catch (err) {
    console.error("JSON parse error:", err.message);
    return fallback;
  }
};

export const classifyIncident = async (title, description) => {
  try {
    const prompt = `
Tu es un assistant de gestion urbaine pour Fianarantsoa.

Analyse ce signalement et retourne UNIQUEMENT un JSON valide:

Titre: ${title}
Description: ${description}

Format:
{
  "category": "eclairage|route|securite|dechets|autre",
  "priority": "low|medium|high|urgent",
  "summary": "1 phrase",
  "suggestedAction": "action concrète"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return safeJSONParse(text, {
      category: "autre",
      priority: "low",
      summary: description,
      suggestedAction: "Analyse manuelle requise"
    });

  } catch (error) {
    console.error("Gemini classify error:", error);
    return {
      category: "autre",
      priority: "low",
      summary: description
    };
  }
};

export const generatePlaceDescription = async (place) => {
  try {
    const prompt = `
Tu es un guide touristique expert de Madagascar.

Écris une description captivante (max 150 mots).

Lieu: ${place.name}
Catégorie: ${place.category}
Histoire: ${place.history || "non disponible"}
`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();

  } catch (error) {
    console.error("Gemini place error:", error);
    return "Description non disponible pour le moment.";
  }
};

export const generateAuthorityResponse = async (incident) => {
  try {
    const prompt = `
Tu es un agent municipal de Fianarantsoa.

Réponds en 2-3 phrases maximum.

Problème: ${incident.title}
Catégorie: ${incident.category}
`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();

  } catch (error) {
    console.error("Gemini response error:", error);
    return "Votre signalement a été enregistré et sera traité prochainement.";
  }
};

export const semanticSearch = async (query, places) => {
  try {
    const prompt = `
Tu es un moteur de recherche pour Fianarantsoa.

Query: "${query}"

Lieux:
${places.map(p => ({
      id: p._id,
      name: p.name,
      category: p.category,
      tags: p.tags
    })).slice(0, 20)}

Retourne uniquement un tableau JSON des IDs les plus pertinents:
["id1","id2"]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return safeJSONParse(text, []);

  } catch (error) {
    console.error("Gemini search error:", error);
    return [];
  }
};

const withTimeout = (promise, ms = 10000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout Gemini")), ms)
    )
  ]);
