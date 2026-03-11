const TIER_NAMES = { 1: 'Basic', 2: 'Essentials', 3: 'Plus', 4: 'All-in-One' };

function computeFitScore(row) {
  let score = 50;
  const mau = parseFloat(row.mau) || 0;
  const employees = parseInt(row.total_employees) || 0;
  const tenure = parseFloat(row.tenure_months) || 0;
  const tierId = parseInt(row.tier_id) || 1;

  // MAU contribution (up to 20 points)
  if (mau > 20) score += 20;
  else if (mau > 10) score += 14;
  else if (mau > 5) score += 8;
  else if (mau > 0) score += 4;

  // Feature adoption (up to 16 points, 4 per feature)
  const features = [row.used_scheduling, row.used_mobile, row.used_web, row.used_messaging];
  const adoptedCount = features.filter(f => parseInt(f) === 1).length;
  score += adoptedCount * 4;

  // Employee count (up to 8 points)
  if (employees >= 20) score += 8;
  else if (employees >= 10) score += 5;
  else if (employees >= 5) score += 3;

  // Tenure — sweet spot 6–36 months (up to 6 points)
  if (tenure >= 6 && tenure <= 36) score += 6;
  else if (tenure > 36) score += 3;

  // Plan tier bonus
  score += (tierId - 1) * 2;

  return Math.min(score, 99);
}

function buildTags(row) {
  const tags = [];
  const employees = parseInt(row.total_employees) || 0;
  const locations = parseInt(row.location_count) || 1;
  const tierId = parseInt(row.tier_id) || 1;

  if (locations > 1) tags.push({ l: 'Multi-location', s: 'Databricks', c: 1.0 });
  if (parseInt(row.used_scheduling) === 1) tags.push({ l: 'Uses scheduling', s: 'Databricks', c: 1.0 });
  if (parseInt(row.used_mobile) === 1) tags.push({ l: 'Uses mobile app', s: 'Databricks', c: 1.0 });
  if (parseInt(row.used_web) === 1) tags.push({ l: 'Uses web', s: 'Databricks', c: 1.0 });
  if (parseInt(row.used_messaging) === 1) tags.push({ l: 'Uses messaging', s: 'Databricks', c: 1.0 });
  if (employees >= 20) tags.push({ l: 'Large team (20+)', s: 'Databricks', c: 1.0 });
  else if (employees >= 10) tags.push({ l: 'Mid-size team (10+)', s: 'Databricks', c: 1.0 });
  if (tierId >= 3) tags.push({ l: TIER_NAMES[tierId] + ' plan', s: 'Databricks', c: 1.0 });

  return tags;
}

function buildMatchReason(row) {
  const plan = TIER_NAMES[parseInt(row.tier_id)] || 'Basic';
  const city = `${row.city || ''}${row.state_cleaned ? ', ' + row.state_cleaned : ''}`.trim();
  const employees = parseInt(row.total_employees) || 0;
  const tenure = Math.round(parseFloat(row.tenure_months) || 0);

  const featureNames = [];
  if (parseInt(row.used_scheduling) === 1) featureNames.push('scheduling');
  if (parseInt(row.used_mobile) === 1) featureNames.push('mobile app');
  if (parseInt(row.used_web) === 1) featureNames.push('web');
  if (parseInt(row.used_messaging) === 1) featureNames.push('messaging');

  const featureStr = featureNames.length > 0
    ? `Uses ${featureNames.join(', ')}.`
    : 'Minimal feature adoption so far.';

  return `Active ${plan} customer in ${city} with ${employees} employees. ${featureStr} ${tenure} months on platform.`;
}

export function transformRows(rows, schema) {
  // schema.columns is array of { name, ... }
  const cols = schema.columns.map(c => c.name.toLowerCase());

  function val(row, name) {
    const idx = cols.indexOf(name.toLowerCase());
    return idx >= 0 ? row[idx] : null;
  }

  return rows.map(row => {
    const obj = {};
    cols.forEach((col, i) => { obj[col] = row[i]; });

    const firstName = obj.first_name || '';
    const lastName = obj.last_name || '';
    const contactName = `${firstName} ${lastName}`.trim() || 'Unknown';
    const city = obj.city || '';
    const state = obj.state_cleaned || '';
    const cityStr = city && state ? `${city}, ${state}` : city || state || 'Unknown';
    const tenure = Math.round(parseFloat(obj.tenure_months) || 0);
    const tierId = parseInt(obj.tier_id) || 1;

    const featureAdoptionCount = [obj.used_scheduling, obj.used_mobile, obj.used_web, obj.used_messaging]
      .filter(f => parseInt(f) === 1).length;

    return {
      // Raw fields for export
      _raw: {
        role: obj.role,
        first_name: firstName,
        last_name: lastName,
        email: obj.email,
        phone: obj.phone,
        location_id: obj.location_id,
        company_id: obj.company_id,
        location_name: obj.location_name,
        industry: obj.business_type_new,
        category: obj.business_category_new,
        city: city,
        state: state,
        plan: TIER_NAMES[tierId] || 'Basic',
        employees: parseInt(obj.total_employees) || 0,
        locations: parseInt(obj.location_count) || 1,
        tenure_months: tenure,
        active: obj.active_now,
        used_scheduling: obj.used_scheduling,
        used_mobile: obj.used_mobile,
        used_web: obj.used_web,
        used_messaging: obj.used_messaging,
      },
      // UI card fields
      name: obj.location_name || 'Unknown',
      industry: obj.business_type_new || 'Other',
      city: cityStr,
      plan: TIER_NAMES[tierId] || 'Basic',
      employees: parseInt(obj.total_employees) || 0,
      locations: parseInt(obj.location_count) || 1,
      tenure: `${tenure} months`,
      activeScore: Math.min(Math.round((parseFloat(obj.mau) || 0) * 3), 99),
      fitScore: computeFitScore(obj),
      tags: buildTags(obj),
      contact: {
        name: contactName,
        title: obj.role || 'Owner',
        channel: 'Email',
        rate: null,
        source: 'Databricks',
      },
      lastContact: null,
      matchReason: buildMatchReason(obj),
    };
  });
}
