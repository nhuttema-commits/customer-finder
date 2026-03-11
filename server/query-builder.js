export function buildSearchSQL(brief) {
  const { goal = '', audience = '', context = '', count } = brief;
  const text = `${goal} ${audience} ${context}`.toLowerCase();
  const limit = parseInt(count) || 25;

  const filters = [];

  // City filter — extract "in [City]" or "in [City], [State]" from brief
  const cityMatch = text.match(/\bin ([a-z][a-z\s]{1,20}?)(?:[,.]|$| and | or | with | for | who)/);
  if (cityMatch) {
    const cityName = cityMatch[1].trim();
    // Exclude generic words that aren't cities
    const notCities = new Set(['the', 'a', 'an', 'my', 'our', 'their', 'this', 'that', 'which', 'what', 'how', 'restaurants', 'cafes', 'gyms', 'shops', 'stores']);
    if (!notCities.has(cityName)) {
      filters.push(`l.city ILIKE '%${cityName.replace(/'/g, "''")}%'`);
    }
  }

  // Business type filters
  if (text.includes('cafe') || text.includes('coffee') || text.includes('bakery')) {
    filters.push(`l.business_type_new ILIKE '%food%' OR l.business_type_new ILIKE '%cafe%' OR l.business_type_new ILIKE '%coffee%' OR l.business_type_new ILIKE '%bakery%' OR l.name ILIKE '%cafe%' OR l.name ILIKE '%coffee%' OR l.name ILIKE '%bakery%'`);
  } else if (text.includes('restaurant') || text.includes('food')) {
    filters.push(`l.business_type_new ILIKE '%restaurant%' OR l.business_type_new ILIKE '%food%'`);
  } else if (text.includes('fitness') || text.includes('gym')) {
    filters.push(`l.business_type_new ILIKE '%fitness%' OR l.business_type_new ILIKE '%gym%'`);
  } else if (text.includes('beauty') || text.includes('salon') || text.includes('spa')) {
    filters.push(`l.business_type_new ILIKE '%beauty%' OR l.business_type_new ILIKE '%salon%' OR l.business_type_new ILIKE '%spa%'`);
  } else if (text.includes('retail')) {
    filters.push(`l.business_type_new ILIKE '%retail%'`);
  } else if (text.includes('healthcare') || text.includes('medical') || text.includes('dental')) {
    filters.push(`l.business_type_new ILIKE '%health%' OR l.business_type_new ILIKE '%medical%' OR l.business_type_new ILIKE '%dental%'`);
  }

  // Franchise filter
  if (text.includes('franchise')) {
    filters.push(`l.business_category_new ILIKE '%franchise%'`);
  }

  // Plan filters
  if (text.includes('payroll') || text.includes('pay run')) {
    filters.push(`l.tier_id >= 3`);
  }
  if (text.includes('plus plan') || text.includes('plus tier')) {
    filters.push(`l.tier_id = 3`);
  }
  if (text.includes('all-in-one') || text.includes('enterprise') || text.includes('aio')) {
    filters.push(`l.tier_id = 4`);
  }
  if (text.includes('basic plan') || text.includes('basic tier')) {
    filters.push(`l.tier_id = 1`);
  }

  // Feature usage filters
  if (text.includes('schedul') || text.includes('shift')) {
    filters.push(`l.used_scheduling = 1`);
  }
  if (text.includes('mobile') || text.includes('app')) {
    filters.push(`l.used_mobile = 1`);
  }
  if (text.includes('web') || text.includes('desktop')) {
    filters.push(`l.used_web = 1`);
  }
  if (text.includes('messag') || text.includes('communicate') || text.includes('team chat')) {
    filters.push(`l.used_messaging = 1`);
  }

  // Multi-location filter
  if (text.includes('multi-location') || text.includes('multiple location') || text.includes('multi location')) {
    filters.push(`c.location_count > 1`);
  }

  // Churn/cancelled — override to look at archived locations
  const isChurn = text.includes('churn') || text.includes('cancel') || text.includes('churned') || text.includes('left');
  const archivedFilter = isChurn ? `l.archived_at IS NOT NULL` : `l.archived_at IS NULL`;

  const extraWhereClause = filters.length > 0 ? `AND (${filters.join(') AND (')})` : '';

  const baseWhere = `
    ${archivedFilter}
    AND DATEDIFF(CURRENT_DATE(), l.created_at) >= 30
    AND l.state_cleaned NOT IN ('Not USA', 'Unclassified')
    ${extraWhereClause}
  `;

  const sql = `
WITH engaged AS (
  SELECT location_id
  FROM bizops.product_location_engagement_metrics
  WHERE date = (SELECT MAX(date) FROM bizops.product_location_engagement_metrics)
    AND engagement_boolean = 1
)

SELECT
  l.location_id, l.company_id,
  l.name AS location_name,
  l.business_type_new, l.business_category_new,
  l.city, l.state_cleaned,
  l.total_employees, l.tier_id,
  l.phone, l.active_now, l.mau,
  l.used_scheduling, l.used_mobile, l.used_web, l.used_messaging,
  l.created_at,
  c.location_count, c.channel,
  u.first_name, u.last_name, u.email,
  'Owner' AS role,
  MONTHS_BETWEEN(CURRENT_DATE(), l.created_at) AS tenure_months
FROM public.locations l
JOIN engaged e ON e.location_id = l.location_id
JOIN public.companies c ON c.company_id = l.company_id
JOIN public.users u ON u.user_id = c.owner_id
WHERE ${baseWhere}

UNION ALL

SELECT
  l.location_id, l.company_id,
  l.name AS location_name,
  l.business_type_new, l.business_category_new,
  l.city, l.state_cleaned,
  l.total_employees, l.tier_id,
  l.phone, l.active_now, l.mau,
  l.used_scheduling, l.used_mobile, l.used_web, l.used_messaging,
  l.created_at,
  c.location_count, c.channel,
  u.first_name, u.last_name, u.email,
  j.level AS role,
  MONTHS_BETWEEN(CURRENT_DATE(), l.created_at) AS tenure_months
FROM public.locations l
JOIN engaged e ON e.location_id = l.location_id
JOIN public.companies c ON c.company_id = l.company_id
JOIN postgres.jobs j ON j.location_id = l.location_id
  AND j.level IN ('Manager', 'General Manager')
JOIN public.users u ON u.user_id = j.user_id
WHERE ${baseWhere}

ORDER BY tenure_months DESC
LIMIT ${limit * 3}
  `.trim();

  return { sql, limit };
}
