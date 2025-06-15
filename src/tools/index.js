/**
 * מרכז רישום כל הכלים - נקודת כניסה אחת לכל הtools
 */

import { registerListAllDatasetsTool } from './datasets.js';
import { registerFindDatasetsTool } from './find.js';
import { registerGetDatasetInfoTool } from './dataset_info.js';
import { registerListResourcesTool } from './resources.js';
import { registerSearchRecordsTool } from './search.js';
import { registerOrganizationTools } from './organizations.js';

/**
 * רושם את כל הכלים על שרת MCP
 * @param {McpServer} mcp - שרת MCP
 */
export function registerAllTools(mcp) {
  console.error('📋 Registering MCP tools...');
  
  try {
    // רישום כל הכלים - find_datasets ראשון כי זה הכלי המומלץ
    registerFindDatasetsTool(mcp);
    console.error('  ✅ find_datasets registered');
    
    registerGetDatasetInfoTool(mcp);
    console.error('  ✅ get_dataset_info registered');
    
    registerOrganizationTools(mcp);
    console.error('  ✅ list_organizations & get_organization_info registered');
    
    registerListAllDatasetsTool(mcp);
    console.error('  ✅ list_all_datasets registered');
    
    registerListResourcesTool(mcp);
    console.error('  ✅ list_resources registered');
    
    registerSearchRecordsTool(mcp);
    console.error('  ✅ search_records registered');
    
    console.error('🎯 All tools registered successfully!');
    
  } catch (error) {
    console.error('❌ Error registering tools:', error);
    throw error;
  }
}

/**
 * מידע על הכלים הזמינים (לשימוש עתידי)
 */
export const AVAILABLE_TOOLS = {
  find_datasets: {
    description: '🔍 RECOMMENDED: Advanced search for datasets with sorting and filtering options.',
    parameters: ['query?', 'sort?', 'tags?'],
    examples: [
      'find_datasets with query="תקציב"',
      'find_datasets with query="budget" and sort="newest"',
      'find_datasets with query="municipality" and sort="popular"',
      'find_datasets with tags="transportation"',
      'find_datasets with query="health" and tags="medical" and sort="updated"'
    ],
    sortOptions: ['newest', 'relevance', 'popular', 'updated'],
    notes: 'At least one of query or tags is required. Sort options: newest (creation date), relevance (best match), popular (most viewed), updated (recently modified).'
  },

  get_dataset_info: {
    description: '📊 DETAILED: Get comprehensive information about a specific dataset including metadata, resources, and usage guidance.',
    parameters: ['dataset'],
    examples: [
      'get_dataset_info with dataset="branches"',
      'get_dataset_info with dataset="jerusalem-municipality-budget"', 
      'get_dataset_info with dataset="mechir-lamishtaken"'
    ],
    features: [
      'Complete metadata (creation date, last modified, views, tags)',
      'Organization information', 
      'Resource analysis (which ones are searchable)',
      'Ready-to-use resource IDs for search_records',
      'Data quality indicators',
      'Usage recommendations'
    ],
    notes: 'Perfect bridge between find_datasets and search_records. Shows exactly what data is available and how to access it.'
  },

  list_organizations: {
    description: '🏛️ EXPLORE: Get list of all government organizations.',
    parameters: [],
    examples: ['list_organizations - shows all government organizations'],
    features: [
      'Complete list of government organizations',
      'Organization names for further exploration',
      'Foundation for organization research'
    ],
    notes: 'Great for understanding the government data landscape and finding datasets by ministry or agency.'
  },

  get_organization_info: {
    description: '🏢 DETAILED: Get comprehensive information about a specific government organization.',
    parameters: ['organization'],
    examples: [
      'get_organization_info with organization="ministry-of-health"',
      'get_organization_info with organization="tel-aviv-yafo"',
      'get_organization_info with organization="cbs"'
    ],
    features: [
      'Organization metadata and description',
      'Technical metadata and configuration',
      'User and permission information',
      'Administrative details'
    ],
    notes: 'Use organization names from list_organizations. Names are usually in English and lowercase.'
  },
  
  list_all_datasets: {
    description: '⚠️ EXPENSIVE: List all available datasets from data.gov.il (1170+ items). Use find_datasets for search instead.',
    parameters: [],
    examples: ['Simple call with no parameters - only when you need the complete list']
  },
  
  list_resources: {
    description: 'List resources for a specific dataset and get resource IDs for data access.',
    parameters: ['dataset', 'include_tracking?'],
    examples: [
      'list_resources with dataset="branches"',
      'list_resources with dataset="jerusalem-municipality-budget" and include_tracking=true'
    ],
    notes: 'Look for resources with datastore_active=true to use with search_records. Consider using get_dataset_info for more detailed analysis.'
  },
  
  search_records: {
    description: '🎯 POWERFUL: Search and extract actual data from government resources with advanced filtering, sorting, and pagination.',
    parameters: ['resource_id', 'q?', 'limit?', 'offset?', 'filters?', 'fields?', 'sort?', 'include_total?', 'distinct?'],
    examples: [
      'search_records with resource_id="2202bada-4baf-45f5-aa61-8c5bad9646d3" and limit=5',
      'search_records with resource_id="..." and q="תל אביב" and limit=20',
      'search_records with resource_id="..." and filters={"City": "תל אביב", "Type": "בנק"}',
      'search_records with resource_id="..." and fields=["Name", "City", "Address"] and sort=["Name asc"]',
      'search_records with resource_id="..." and distinct="City"'
    ],
    parameterDetails: {
      resource_id: 'UUID from list_resources or get_dataset_info (required). Must have datastore_active=true.',
      q: 'Free-text search across all fields. Supports Hebrew/English and partial matches.',
      limit: 'Number of results (1-1000). Use 5-10 for exploration, 100+ for analysis.',
      offset: 'Skip N results for pagination. Use with limit for paging.',
      filters: 'Exact matches as JSON. Examples: {"City": "תל אביב"}, {"City": ["תל אביב", "חיפה"]}',
      fields: 'Return specific fields only. Improves performance and reduces response size.',
      sort: 'Sort by fields. Format: ["field_name asc/desc"]. Multiple sorts supported.',
      include_total: 'Include total count for pagination planning.',
      distinct: 'Get unique values for a field (returns values, not full records).'
    },
    useCases: [
      'Data exploration: Basic search with small limit',
      'Analysis: Large limit with specific fields',
      'Geographic analysis: Filter by location, get distinct cities',
      'Financial data: Sort by amount, filter by date ranges',
      'Pagination: Use limit/offset with include_total',
      'Performance: Use fields parameter for large datasets'
    ],
    notes: 'This is the most powerful tool for actual data extraction. Always start with small limits to understand the data structure.'
  }
};

/**
 * סטטיסטיקות על הכלים (לשימוש עתידי)
 */
export function getToolsInfo() {
  return {
    totalTools: Object.keys(AVAILABLE_TOOLS).length,
    toolNames: Object.keys(AVAILABLE_TOOLS),
    version: '1.2.0' // עדכון לגרסה נכונה
  };
}

/**
 * זרימת עבודה מומלצת עם הכלים
 */
export const RECOMMENDED_WORKFLOW = {
  step1: {
    tool: 'find_datasets',
    purpose: 'Find relevant datasets by topic/keywords',
    example: 'find_datasets("budget municipality")'
  },
  step2: {
    tool: 'get_dataset_info',
    purpose: 'Get detailed info about interesting datasets',
    example: 'get_dataset_info("jerusalem-municipality-budget")'
  },
  step3: {
    tool: 'search_records',
    purpose: 'Extract and analyze actual data using resource IDs',
    example: 'search_records(resource_id="...", limit=10)'
  },
  step4: {
    tool: 'search_records (advanced)',
    purpose: 'Perform detailed analysis with filters/sorting',
    example: 'search_records(resource_id="...", filters={"Category": "Infrastructure"}, sort=["Amount desc"])'
  }
};

/**
 * זרימות עבודה אלטרנטיביות
 */
export const ALTERNATIVE_WORKFLOWS = {
  organizationResearch: {
    description: 'Research government organizations and their data publishing',
    steps: [
      'list_organizations → see all government organizations',
      'get_organization_info → detailed org analysis', 
      'find_datasets → search org-specific datasets',
      'get_dataset_info → analyze specific datasets'
    ]
  },
  topicExploration: {
    description: 'Explore data on a specific topic across government',
    steps: [
      'find_datasets → discover relevant datasets',
      'get_dataset_info → understand data structure',
      'get_organization_info → understand data sources',
      'search_records → extract and analyze data'
    ]
  },
  quickAnalysis: {
    description: 'Quick data exploration when you know the dataset name',
    steps: [
      'get_dataset_info → understand data structure',
      'search_records (basic) → sample the data',
      'search_records (filtered) → targeted analysis'
    ]
  },
  comprehensiveResearch: {
    description: 'Thorough research starting from topic',
    steps: [
      'find_datasets → discover datasets',
      'list_organizations → understand sources',
      'get_dataset_info (multiple) → compare datasets',
      'search_records (comparative) → analyze data'
    ]
  }
};

/**
 * קטגוריות כלים לפי שימוש
 */
export const TOOL_CATEGORIES = {
  discovery: {
    name: 'Data Discovery',
    tools: ['find_datasets', 'list_organizations', 'list_all_datasets'],
    purpose: 'Find and explore available datasets and organizations'
  },
  analysis: {
    name: 'Data Analysis', 
    tools: ['get_dataset_info', 'get_organization_info', 'list_resources'],
    purpose: 'Understand data structure and metadata'
  },
  extraction: {
    name: 'Data Extraction',
    tools: ['search_records'],
    purpose: 'Extract and filter actual data for analysis'
  }
};