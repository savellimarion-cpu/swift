const API_URL = "https://api.openai.com/v1/images/generations";

/**
 * Correspondance entre les formats proposés par l'agent Designer et les
 * tailles supportées par gpt-image-1 (carré / portrait / paysage — pas de
 * ratio exact pour 4:5 et 9:16, on prend le portrait le plus proche).
 */
export const FORMAT_TO_SIZE: Record<string, "1024x1024" | "1024x1536" | "1536x1024"> = {
  "1:1": "1024x1024",
  "4:5": "1024x1536",
  "9:16": "1024x1536",
  "16:9": "1536x1024",
};

interface OpenAIImageResponse {
  data?: { b64_json?: string }[];
}

/**
 * Génère une image via l'API OpenAI (gpt-image-1) et renvoie une data URL
 * (`data:image/jpeg;base64,...`) prête à être stockée et affichée.
 */
export async function generateImage(
  prompt: string,
  size: "1024x1024" | "1024x1536" | "1536x1024" = "1024x1024"
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY n'est pas configurée. Ajoute-la dans .env (voir .env.example) et dans les variables d'environnement Vercel."
    );
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size,
      quality: "medium",
      output_format: "jpeg",
      output_compression: 80,
      n: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API OpenAI (${res.status}) : ${text}`);
  }

  const data: OpenAIImageResponse = await res.json();
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("OpenAI n'a renvoyé aucune image.");
  }
  return `data:image/jpeg;base64,${b64}`;
}
