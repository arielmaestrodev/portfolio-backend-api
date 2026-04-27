import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { ENV } from "@/config/env";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY || "");

const CHAT_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro"
];

const EMBEDDING_MODEL = "gemini-embedding-2";

/**
 * Utility to chunk text for embeddings.
 * If the text exceeds 2000 characters, it is split into chunks with a 200-character overlap.
 */
function chunkText(text: string, size: number = 2000, overlap: number = 200): string[] {
  if (text.length <= size) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.slice(start, end));
    start += size - overlap;
    if (start >= text.length - overlap && start < text.length) break; 
  }
  return chunks;
}

/**
 * Generate an embedding for a given text using Gemini.
 * Chunks long text and returns the averaged embedding.
 * @param text The input text to embed.
 * @returns An array of numbers representing the vector.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const chunks = chunkText(text);
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  
  // Use gemini-embedding-2 which supports flexible output dimensions.
  // We specify 768 to match the existing database schema.
  const embedOptions = (t: string) => ({
    content: { parts: [{ text: t }], role: "user" },
    outputDimensionality: 768
  });

  if (chunks.length === 1) {
    const result = await model.embedContent(embedOptions(chunks[0]));
    return result.embedding.values;
  }

  const results = await Promise.all(
    chunks.map(chunk => model.embedContent(embedOptions(chunk)))
  );
  const embeddings = results.map(r => r.embedding.values);

  // Average embeddings to maintain single-vector compatibility
  const dim = embeddings[0].length;
  const avg = new Array(dim).fill(0);
  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) {
      avg[i] += emb[i];
    }
  }
  return avg.map(v => v / embeddings.length);
}

/**
 * Generate a chat response based on a prompt and provided context.
 * Falls back through available Gemini models sequentially.
 * @param prompt The user's question.
 * @param context The retrieved knowledge chunks.
 * @param history Optional chat history for conversational memory.
 * @returns The AI's response text.
 */
export async function generateChatResponse(
  prompt: string, 
  context: string, 
  history: Content[] = []
): Promise<string> {
  const fullPrompt = `Context:\n${context}\n\nQuestion: ${prompt}`;
  let lastError: any;

  for (const modelName of CHAT_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: `You are Ariel Batoon, a professional Full Stack Developer. You are chatting with a visitor on your portfolio website.
        RULES:
        1. INTRODUCTION: Always introduce yourself as Ariel Batoon in your initial greeting or if the user asks who you are.
        2. PERSONA: Speak in the first person (use "I", "me", "my"). Be professional, friendly, and technically confident.
        3. RAG CONTEXT: Use the provided context to answer specific questions about my projects, background, and experience. This is your primary source for "facts" about me.
        4. NON-RAG FALLBACK: If the user asks a general question that is NOT in the context, you may answer it ONLY if it is related to software development, programming, or technology. For non-technical topics, politely state that you are here to discuss your professional work and development expertise.
        5. UNKNOWN FACTS: If asked a specific personal/professional question that is NOT in the context, politely explain that you haven't added that detail to your portfolio yet, but offer to discuss my existing projects or skills.`
      });

      // Limit history to last 6 messages to keep context concise but relevant
      const chat = model.startChat({
        history: history.slice(-6),
      });

      const result = await chat.sendMessage(fullPrompt);
      return result.response.text();
    } catch (error) {
      console.warn(`Model ${modelName} failed, falling back...`, error);
      lastError = error;
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message || "Unknown error"}`);
}