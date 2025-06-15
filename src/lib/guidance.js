/**
 * הדרכות ועזרה למשתמשים
 */

import { EXAMPLE_RESOURCE_IDS, COMMON_KEYWORDS, POPULAR_ORGANIZATIONS } from '../config/constants.js';

/**
 * הצעות לפתרון בעיות נפוצות
 */
export const TROUBLESHOOTING = {
  datasets: [
    'Check if dataset name is correct (use find_datasets to search, or list_all_datasets if you need everything)',
    'Some datasets use Hebrew names',
    'Popular working datasets: branches, mechir-lamishtaken'
  ],
  
  organizations: [
    'Check if organization name is correct (use list_organizations to see all)',
    'Organization names are usually in English and lowercase',
    'Try variations like "ministry-of-health" or "health"'
  ],
  
  search: [
    'Verify resource_id is correct (get from list_resources)',
    'Check if resource has datastore_active=true',
    'Try simpler query first (no filters/fields)',
    'Some resources may be temporarily unavailable'
  ],
  
  api: [
    'Try again in a moment - the government API might be temporarily unavailable',
    'Check internet connection',
    'Verify CKAN endpoint is accessible'
  ]
};

/**
 * דוגמאות עבודה למשתמשים
 */
export const WORKING_EXAMPLES = {
  search: [
    `Bank branches: '${EXAMPLE_RESOURCE_IDS.bankBranches}'`,
    `Air quality stations: '${EXAMPLE_RESOURCE_IDS.airStations}'`,
    `Contaminated land: '${EXAMPLE_RESOURCE_IDS.contaminatedLand}'`,
    'Try search with q="תל אביב" and limit=5'
  ],
  
  queries: [
    'Cities: "תל אביב", "ירושלים", "חיפה"',
    'Organizations: "בנק לאומי", "משרד הבריאות"',
    'Dates: "2023", "2024-01"'
  ],
  
  organizations: [
    'ministry-of-health → Health ministry datasets',
    'tel-aviv-yafo → Tel Aviv municipal data', 
    'cbs → Central Bureau of Statistics',
    'jerusalem → Jerusalem municipality'
  ]
};

/**
 * טיפים לביצועים
 */
export const PERFORMANCE_TIPS = [
  "Use 'fields' parameter to get only needed columns",
  "Use 'limit' 5-20 for quick exploration",
  "Use 'filters' for exact matches (faster than 'q')",
  "Include 'include_total' for pagination planning"
];

/**
 * הצעות לניתוח נתונים
 */
export const ANALYSIS_SUGGESTIONS = [
  "For statistics: use 'distinct' to count unique values",
  "For large datasets: start with small limit, then increase",
  "For geographic data: filter by City/Region first",
  "For financial data: sort by Amount/Date fields"
];

/**
 * קונטקסטים סמנטיים לשימוש בכלים
 */
export const SEMANTIC_CONTEXTS = [
  'Government transparency and open data analysis',
  'Municipal budget tracking and spending analysis',
  'Business intelligence on Israeli market data',
  'Demographics and population studies',
  'Infrastructure and transportation planning',
  'Financial services mapping and analysis'
];

/**
 * זרימת עבודה מומלצת
 */
export const RECOMMENDED_WORKFLOW = [
  '🚀 RECOMMENDED WORKFLOW:',
  '1. 🔍 START with find_datasets to search by topic/keywords',
  '2. 🏛️ OPTIONAL: Use list_organizations to explore by government body',
  '3. 📊 Use get_dataset_info for detailed dataset analysis',
  '4. 📋 Use list_resources on interesting datasets', 
  '5. 🎯 Use search_records to get actual data',
  '6. ⚠️ Only use list_all_datasets if you need the complete list (expensive API call!)'
];

/**
 * יוצר הודעת עזרה מותאמת אישית
 * @param {string} context - הקשר (datasets, resources, search, organizations)
 * @param {Object} options - אפשרויות נוספות
 * @returns {string} הודעת עזרה מפורמטת
 */
export function createHelpMessage(context, options = {}) {
  switch (context) {
    case 'datasets':
      return [
        '💡 USAGE GUIDE:',
        '⚠️ IMPORTANT: Use find_datasets for searching, not list_all_datasets (expensive!)',
        '• Start with find_datasets to search by keywords or topics',
        '• Look for datasets related to: budgets, demographics, transportation, municipalities',
        `• Common Hebrew keywords: ${COMMON_KEYWORDS.hebrew.join(', ')}`,
        '• Next step: Use list_resources with interesting dataset names',
        "• Pro tip: Many datasets have English equivalents (look for '_en' suffix)",
        '',
        ...RECOMMENDED_WORKFLOW
      ].join('\n');
      
    case 'organizations':
      return [
        '🏛️ ORGANIZATION GUIDE:',
        '• Use list_organizations to see all government bodies',
        '• Use get_organization_info for detailed organization analysis',
        '• Organization names are usually lowercase English',
        `• Popular organizations: ${POPULAR_ORGANIZATIONS.join(', ')}`,
        '',
        '💡 WORKFLOW:',
        '1. list_organizations → see all available organizations',
        '2. get_organization_info("org-name") → detailed info',
        '3. find_datasets → search for organization-specific datasets',
        '4. Continue with regular dataset workflow'
      ].join('\n');
      
    case 'resources':
      return [
        '💡 NEXT STEPS:',
        '• Copy a resource_id from datastore_active=true resources',
        '• Use search_records with that resource_id',
        '• Look for CSV/XLSX formats - they\'re usually most complete',
        '• Hebrew resources often have English equivalents',
        '',
        '🔍 SEARCH TIPS:',
        '• Fields vary by dataset - check the data structure first',
        '• Common fields: Name, City, Address, Date, Amount',
        '• Use include_tracking=true to see update frequency'
      ].join('\n');
      
    case 'search':
      return [
        '💡 SEARCH OPTIMIZATION:',
        '',
        '🔍 QUERY PATTERNS THAT WORK WELL:',
        ...WORKING_EXAMPLES.queries.map(tip => `• ${tip}`),
        '',
        '⚡ PERFORMANCE TIPS:',
        ...PERFORMANCE_TIPS.map(tip => `• ${tip}`),
        '',
        '📈 ANALYSIS SUGGESTIONS:',
        ...ANALYSIS_SUGGESTIONS.map(tip => `• ${tip}`),
        '',
        '🎪 SEMANTIC CONTEXTS FOR THIS TOOL:',
        ...SEMANTIC_CONTEXTS.map(context => `• ${context}`)
      ].join('\n');
      
    default:
      return [
        'Use find_datasets to search, list_organizations to explore by government body, or search_records to explore government data.',
        '',
        ...RECOMMENDED_WORKFLOW
      ].join('\n');
  }
}