import { Product } from '../types';

/**
 * Calculates the Damerau-Levenshtein distance between two strings,
 * accounting for insertions, deletions, substitutions, and transpositions.
 */
export function levenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  const len1 = s1.length;
  const len2 = s2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  const d: number[][] = Array.from({ length: len1 + 1 }, () =>
    new Array(len2 + 1).fill(0)
  );

  for (let i = 0; i <= len1; i++) d[i][0] = i;
  for (let j = 0; j <= len2; j++) d[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (
        i > 1 &&
        j > 1 &&
        s1[i - 1] === s2[j - 2] &&
        s1[i - 2] === s2[j - 1]
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[len1][len2];
}

/**
 * Computes a fuzzy sequential sub-sequence score.
 * Higher score indicates tighter match, consecutive matches, and word-boundary starts.
 */
export function fuzzySubsequenceScore(target: string, query: string): number {
  const t = target.toLowerCase();
  const q = query.toLowerCase();

  if (t === q) return 100;
  if (t.startsWith(q)) return 85 + Math.min(10, q.length);
  if (t.includes(q)) return 70 + Math.min(15, (q.length / t.length) * 20);

  let tIdx = 0;
  let qIdx = 0;
  let score = 0;
  let consecutiveMatches = 0;

  while (tIdx < t.length && qIdx < q.length) {
    if (t[tIdx] === q[qIdx]) {
      // Bonus for match at word boundary (start of string or preceded by space/punctuation)
      const isWordBoundary = tIdx === 0 || /[\s\-_/.]/.test(t[tIdx - 1]);
      if (isWordBoundary) {
        score += 8;
      } else {
        score += 3;
      }

      // Bonus for consecutive matched characters
      consecutiveMatches++;
      score += consecutiveMatches * 2;

      qIdx++;
    } else {
      consecutiveMatches = 0;
      // Slight penalty for gap
      score -= 0.5;
    }
    tIdx++;
  }

  // If entire query was found in sequential order
  if (qIdx === q.length) {
    // Normalise based on ratio of query length to target length
    const coverageBonus = (q.length / t.length) * 20;
    return Math.max(10, Math.min(65, score + coverageBonus));
  }

  // Not a full sequential subsequence
  return 0;
}

/**
 * Scores a token against a target word using typo tolerance (Levenshtein)
 */
export function tokenFuzzyScore(targetWord: string, queryToken: string): number {
  const tw = targetWord.toLowerCase();
  const qt = queryToken.toLowerCase();

  if (tw === qt) return 100;
  if (tw.startsWith(qt)) return 85;

  const dist = levenshteinDistance(tw, qt);
  const maxLen = Math.max(tw.length, qt.length);

  // Allow 1 typo for words of length 3-5, 2 typos for 6+
  const maxAllowedTypos = qt.length <= 4 ? 1 : 2;

  if (dist <= maxAllowedTypos) {
    const similarity = 1 - dist / maxLen;
    return Math.round(similarity * 75);
  }

  // Check subsequence match
  const subScore = fuzzySubsequenceScore(tw, qt);
  if (subScore > 0) return subScore;

  return 0;
}

export interface ScoredProduct extends Product {
  searchScore: number;
  matchedFields: string[];
}

/**
 * Searches and ranks products using a multi-field weighted fuzzy matching engine.
 */
export function fuzzySearchProducts(
  products: Product[],
  query: string,
  minThreshold = 18
): ScoredProduct[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return products.map((p) => ({ ...p, searchScore: 100, matchedFields: [] }));
  }

  const queryTokens = trimmed.split(/\s+/).filter(Boolean);

  const scored = products.map((product) => {
    let totalScore = 0;
    const matchedFields: string[] = [];

    // Fields and their relevance multipliers
    const fieldsToSearch: { name: string; text: string; weight: number }[] = [
      { name: 'name', text: product.name, weight: 1.6 },
      { name: 'brand', text: String(product.attributes.brand || ''), weight: 1.4 },
      { name: 'category', text: product.category, weight: 1.2 },
      {
        name: 'attributes',
        text: Object.values(product.attributes).join(' '),
        weight: 0.9,
      },
      { name: 'description', text: product.description, weight: 0.6 },
    ];

    // For each query token, evaluate against each product field
    for (const token of queryTokens) {
      let bestTokenScore = 0;
      let bestFieldName = '';

      for (const field of fieldsToSearch) {
        if (!field.text) continue;

        // Exact substring on whole field
        const subSeq = fuzzySubsequenceScore(field.text, token);
        let fieldScore = subSeq * field.weight;

        // Word-by-word token analysis for typo tolerance
        const words = field.text.split(/[\s,./\-_()]+/).filter(Boolean);
        for (const word of words) {
          const tScore = tokenFuzzyScore(word, token) * field.weight;
          if (tScore > fieldScore) {
            fieldScore = tScore;
          }
        }

        if (fieldScore > bestTokenScore) {
          bestTokenScore = fieldScore;
          bestFieldName = field.name;
        }
      }

      if (bestTokenScore >= minThreshold) {
        totalScore += bestTokenScore;
        if (bestFieldName && !matchedFields.includes(bestFieldName)) {
          matchedFields.push(bestFieldName);
        }
      }
    }

    // Require matching at least a proportion of query tokens
    const avgScore = totalScore / queryTokens.length;

    return {
      ...product,
      searchScore: Math.round(avgScore),
      matchedFields,
    };
  });

  return scored
    .filter((p) => p.searchScore >= minThreshold)
    .sort((a, b) => b.searchScore - a.searchScore);
}
