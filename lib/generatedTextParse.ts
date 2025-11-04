// storyParser.ts - Lightweight and robust story text parser

export interface ParsedStory {
  title: string;
  ageGroup: { min: number; max: number };
  coreConcept: string;
  characters: Array<{
    name: string;
    description: string;
    role?: string;
  }>;
  pages: Array<{
    pageNumber: number;
    text: string;
    illustrationPrompt: string;
    interactiveQuestion?: string;
  }>;
}

export function parseStoryText(storyText: string): ParsedStory {
  try {
    // ✅ Sanitize and limit input (avoid memory blowups)
    storyText = storyText.slice(0, 20000); // Keep max 20KB

    // ✅ Basic cleanup
    const cleanText = storyText.replace(/\r/g, "").trim();

    // --- Extract metadata ---
    const title = extractBetween(cleanText, "**Book Title:**", "\n") || "Untitled Story";
    const ageGroupText = extractBetween(cleanText, "**Age Group:**", "\n") || "3-5";
    const coreConcept = extractBetween(cleanText, "**Core Concept:**", "\n") || "";

    const ageGroup = parseAgeGroup(ageGroupText);

    // --- Extract characters ---
    const charactersSection = extractBetween(cleanText, "**Characters:**", "**Page") || "";
    const characters = parseCharactersSection(charactersSection);

    // --- Extract pages ---
    const pages = parsePagesSection(cleanText);

    console.log("✅ Parsed story:", {
      title,
      ageGroup,
      coreConcept,
      characterCount: characters.length,
      pageCount: pages.length,
    });

    return {
      title,
      ageGroup,
      coreConcept,
      characters,
      pages,
    };
  } catch (error) {
    console.error("❌ Story parsing failed:", error);
    return {
      title: "Error Story",
      ageGroup: { min: 3, max: 5 },
      coreConcept: "",
      characters: [],
      pages: [
        {
          pageNumber: 1,
          text: "An error occurred while parsing this story.",
          illustrationPrompt: "",
        },
      ],
    };
  }
}

// --- Helper functions ---

function extractBetween(text: string, start: string, end?: string): string | null {
  const startIndex = text.indexOf(start);
  if (startIndex === -1) return null;
  const fromStart = text.slice(startIndex + start.length);
  if (!end) return fromStart.trim();
  const endIndex = fromStart.indexOf(end);
  return (endIndex === -1 ? fromStart : fromStart.slice(0, endIndex)).trim();
}

function parseAgeGroup(ageString: string): { min: number; max: number } {
  const nums = ageString.match(/\d+/g)?.map(Number) || [3, 5];
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

function parseCharactersSection(section?: string): ParsedStory["characters"] {
  if (!section) return [];
  const lines = section.split("\n").map((l) => l.trim()).filter(Boolean);

  const characters: ParsedStory["characters"] = [];
  for (const line of lines) {
    if (!line.startsWith("*")) continue;

    const match = line.match(/\*\s*\*\*([^:*]+):\*\*\s*(.+)/);
    if (!match) continue;

    const [_, name, description] = match;
    const role = characters.length === 0 ? "protagonist" : "supporting";
    characters.push({ name: name.trim(), description: description.trim(), role });
  }

  return characters;
}

function parsePagesSection(text: string): ParsedStory["pages"] {
  const pages: ParsedStory["pages"] = [];

  // Split by "**Page X" markers
  const pageBlocks = text.split(/\*\*Page\s+/).slice(1);

  for (const block of pageBlocks) {
    const headerMatch = block.match(/^(\d+(?:-\d+)?):\s*([^*]+)\*\*/);
    if (!headerMatch) continue;

    const [_, pageLabel, title] = headerMatch;
    const startPage = parseInt(pageLabel.split("-")[0]);
    const endPage = parseInt(pageLabel.split("-")[1] || startPage.toString());

    const illustration = extractBetween(block, "**Illustration:**", "\n") || "";
    const textBody = extractBetween(block, "**Text:**") || "";

    // Detect interactive question (* (Question)? *)
    const questionMatch = textBody.match(/\*\((.+?)\)\*/);
    const question = questionMatch ? questionMatch[1].trim() : undefined;
    const cleanText = textBody.replace(/\*\(.+?\)\*/g, "").trim();

    for (let p = startPage; p <= endPage; p++) {
      pages.push({
        pageNumber: p,
        text: cleanText,
        illustrationPrompt: illustration,
        interactiveQuestion: question,
      });
    }
  }

  return pages;
}
