// storyParser.ts - Parse AI-generated story into structured data

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
  // Extract title
  const titleMatch = storyText.match(/\*\*Book Title:\*\*\s*(.+)/i);
  const title = titleMatch ? titleMatch[1].trim() : "Untitled Story";

  // Extract age group
  const ageMatch = storyText.match(/\*\*Age Group:\*\*\s*(.+)/i);
  const ageGroup = ageMatch ? parseAgeGroup(ageMatch[1]) : { min: 3, max: 5 };

  // Extract core concept
  const conceptMatch = storyText.match(
    /\*\*Core Concept:\*\*\s*(.+?)(?=\n\*\*|$)/
  );
  const coreConcept = conceptMatch ? conceptMatch[1].trim() : "";

  // Extract characters
  const characters = parseCharacters(storyText);

  // Extract pages
  const pages = parsePages(storyText);

  console.log("Parsed characters:", storyText);
  console.log("Parsed pages:", { pages, title, ageGroup, coreConcept });

  return {
    title,
    ageGroup,
    coreConcept,
    characters,
    pages,
  };
}

function parseAgeGroup(ageString: string): { min: number; max: number } {
  const matches = ageString.match(/\d+/g);
  if (!matches || matches.length === 0) {
    return { min: 3, max: 5 };
  }
  const ages = matches.map(Number);
  return {
    min: Math.min(...ages),
    max: Math.max(...ages),
  };
}

function parseCharacters(storyText: string): ParsedStory["characters"] {
  const characters: ParsedStory["characters"] = [];

  // Find the Characters section
  const charactersSection = storyText.match(
    /\*\*Characters:\*\*([\s\S]*?)(?=\n\*\*[A-Z]|\n\n\*\*|$)/i
  );
  if (!charactersSection) return characters;

  // Match each character entry (e.g., "* **Winnie the Witch:** Description")
  const characterRegex =
    /\*\s+\*\*([^:*]+):\*\*\s*(.+?)(?=\n\s*\*\s+\*\*|\n\n|$)/;
  let match;

  while ((match = characterRegex.exec(charactersSection[1])) !== null) {
    const name = match[1].trim();
    const description = match[2].trim();

    // Determine role based on order or keywords
    let role = "supporting";
    if (characters.length === 0 || name.toLowerCase().includes("main")) {
      role = "protagonist";
    }

    characters.push({ name, description, role });
  }

  return characters;
}

function parsePages(storyText: string): ParsedStory["pages"] {
  const pages: ParsedStory["pages"] = [];

  // Match page sections like "**Page 1-2: Title**"
  const pageRegex =
    /\*\*Page\s+(\d+)(?:-(\d+))?:\s*([^*]+)\*\*\s*\n-\s+\*\*Illustration:\*\*\s*(.+?)\n-\s+\*\*Text:\*\*\s*([\s\S]+?)(?=\n\*\*Page|\n\n\*\*[A-Z]|$)/gi;
  let match;

  while ((match = pageRegex.exec(storyText)) !== null) {
    const startPage = parseInt(match[1]);
    const endPage = match[2] ? parseInt(match[2]) : startPage;
    const illustrationPrompt = match[4].trim();
    const textContent = match[5].trim();

    // Extract interactive question if present
    const questionMatch = textContent.match(/\*\((.+?)\)\*/);
    const interactiveQuestion = questionMatch
      ? questionMatch[1].trim()
      : undefined;

    // Remove the question from the main text
    const cleanText = textContent.replace(/\*\([^)]+\)\*/g, "").trim();

    // Handle page ranges (e.g., Page 1-2)
    for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
      pages.push({
        pageNumber: pageNum,
        text: cleanText,
        illustrationPrompt,
        interactiveQuestion,
      });
    }
  }

  return pages;
}
