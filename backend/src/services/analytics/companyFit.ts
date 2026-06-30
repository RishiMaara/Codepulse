export interface CompanyFit {
  Google:    number;
  Amazon:    number;
  Microsoft: number;
  Meta:      number;
  Atlassian: number;
  Flipkart:  number;
}

/**
 * Company Fit scores based on readiness score + company-specific multipliers.
 * Each company weights algo depth vs breadth vs system design differently.
 */
export const calculateCompanyFit = (readiness: number): CompanyFit => ({
  Google:    Math.min(Math.round(readiness * 0.90), 100), // most algo-heavy
  Amazon:    Math.min(Math.round(readiness * 1.05), 100), // LP + breadth friendly
  Microsoft: Math.min(Math.round(readiness * 1.00), 100), // balanced
  Meta:      Math.min(Math.round(readiness * 0.95), 100), // graph + hard problems
  Atlassian: Math.min(Math.round(readiness * 0.92), 100), // medium difficulty focus
  Flipkart:  Math.min(Math.round(readiness * 1.02), 100), // competitive programming
});
