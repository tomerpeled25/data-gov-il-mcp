/**
 * כלי find_datasets - חיפוש חכם במאגר datasets עם מיון ותגיות
 */

import { z } from 'zod';
import { ckanRequest } from '../utils/api.js';
import { createErrorResponse } from '../utils/formatters.js';
import { POPULAR_DATASETS } from '../config/constants.js';
import { RECOMMENDED_WORKFLOW } from '../lib/guidance.js';

/**
 * מיפוי של אפשרויות מיון לפרמטרי API
 */
const SORT_OPTIONS = {
  'newest': 'metadata_created desc',           // ברווח במקום +
  'relevance': 'score desc,metadata_modified desc',   // ברווח במקום +
  'popular': 'views_recent desc',              // ברווח במקום +
  'updated': 'metadata_modified desc'          // ברווח במקום +
};

/**
 * מפרמט תוצאות החיפוש מ-package_search
 * @param {Object} result - תוצאות מ-CKAN package_search
 * @param {string} query - מונח החיפוש המקורי
 * @param {string} sort - סדר המיון שנבחר
 * @param {string} tags - תגיות שנבחרו
 * @returns {Array} בלוקי תוכן מפורמטים
 */
function formatFindResults(result, query, sort, tags) {
  const datasets = result.results || [];
  const datasetNames = datasets.map(d => d.name || d.id);
  const totalCount = result.count || datasets.length;
  
  // בניית תיאור החיפוש
  const queryParts = [];
  if (query) queryParts.push(`"${query}"`);
  if (tags) queryParts.push(`tags: "${tags}"`);
  if (sort) queryParts.push(`sorted by: ${sort}`);
  
  const searchDescription = queryParts.length > 0 ? ` for ${queryParts.join(', ')}` : '';
  
  const mainContent = [
    `🔍 Found ${datasetNames.length} datasets${searchDescription} (${totalCount} total matches)`,
    '',
    datasetNames.length > 0 ? '📋 Matching datasets:' : '❌ No datasets found',
    datasetNames.length > 0 ? JSON.stringify(datasetNames, null, 2) : ''
  ].filter(line => line !== '').join('\n');

  let guidanceContent;
  
  if (datasetNames.length === 0) {
    guidanceContent = [
      '💡 SEARCH TIPS:',
      '• Try broader terms: "budget" instead of "municipal budget"',
      '• Use both Hebrew and English: "תקציב budget"',
      '• Try different sorting: newest, relevance, popular, updated',
      '• Try without tags filter if you used one',
      '• Check popular datasets:',
      ...POPULAR_DATASETS.map(d => `  • ${d}`),
      '',
      '🔄 You can also use list_all_datasets to see everything (expensive)'
    ].join('\n');
  } else {
    guidanceContent = [
      '💡 NEXT STEPS:',
      '• Use list_resources with any interesting dataset name',
      '• Example: list_resources with dataset="branches"',
      '',
      '🚀 RECOMMENDED WORKFLOW:',
      ...RECOMMENDED_WORKFLOW.slice(1), // להשמיט את הכותרת
      '',
      '🔍 ADVANCED SEARCH EXAMPLES:',
      '• find_datasets("תקציב", sort="newest") → newest budget datasets',
      '• find_datasets("בנק", sort="popular") → popular banking datasets',
      '• find_datasets("traffic", tags="transportation") → traffic datasets with transportation tag',
      '• find_datasets("health", sort="updated") → recently updated health datasets'
    ].join('\n');
  }

  return [mainContent, guidanceContent];
}

/**
 * רישום הכלי במערכת MCP
 * @param {McpServer} mcp - שרת MCP
 */
export function registerFindDatasetsTool(mcp) {
  mcp.tool(
    "find_datasets",
    {
      query: z.string().optional().describe(
        "Search terms (Hebrew/English). Examples: 'תקציב', 'budget', 'municipality', 'transportation'"
      ),
      sort: z.enum(['newest', 'relevance', 'popular', 'updated']).optional().describe(
        "Sort results by: 'newest' (creation date), 'relevance' (best match), 'popular' (most viewed), 'updated' (recently modified)"
      ),
      tags: z.string().optional().describe(
        "Filter by specific tags. Examples: 'transportation', 'budget', 'health'"
      )
    },
    async ({ query, sort, tags }) => {
      try {
        // בניית תיאור החיפוש לוג
        const searchParts = [];
        if (query) searchParts.push(`query: "${query}"`);
        if (sort) searchParts.push(`sort: ${sort}`);
        if (tags) searchParts.push(`tags: "${tags}"`);
        
        const searchDescription = searchParts.length > 0 ? ` (${searchParts.join(', ')})` : '';
        console.error(`🔍 Searching datasets${searchDescription}...`);
        
        // אם אין query ולא tags, מחזירים שגיאה עם הצעה
        if ((!query || !query.trim()) && (!tags || !tags.trim())) {
          return createErrorResponse(
            'find_datasets',
            new Error('Search query or tags required'),
            [
              'Provide a search term or tags to find relevant datasets',
              'Examples: find_datasets("budget"), find_datasets(tags="transportation")',
              'You can combine: find_datasets("health", tags="medical", sort="newest")',
              'Use list_all_datasets if you need to see everything (expensive)'
            ]
          );
        }
        
        // בניית פרמטרי החיפוש
        const params = {};
        
        // הוספת query אם קיים
        if (query && query.trim()) {
          params.q = query.trim();
        }
        
        // הוספת tags אם קיים
        if (tags && tags.trim()) {
          params.tags = tags.trim();
        }
        
        // הוספת sort אם קיים
        if (sort && SORT_OPTIONS[sort]) {
          params.sort = SORT_OPTIONS[sort];
        }
        
        // קריאה ל-package_search API
        const response = await ckanRequest('package_search', params);
        const result = response.result;
        
        const foundCount = result.results ? result.results.length : 0;
        console.error(`✅ Found ${foundCount} datasets${searchDescription}`);
        
        const contentBlocks = formatFindResults(result, query, sort, tags);
        
        return {
          content: contentBlocks.map(block => ({
            type: "text",
            text: block
          }))
        };
        
      } catch (error) {
        console.error(`❌ Error in find_datasets:`, error.message);
        
        return createErrorResponse(
          'find_datasets',
          error,
          [
            'Try a different search term or tags',
            'Check if the sort option is valid (newest, relevance, popular, updated)',
            'Check your internet connection', 
            'The government API might be temporarily unavailable'
          ]
        );
      }
    }
  );
}