import 'dotenv/config';
import express from 'express';
import { buildSearchSQL } from './query-builder.js';
import { transformRows } from './transform.js';

const app = express();
app.use(express.json());

const DATABRICKS_HOST = process.env.DATABRICKS_HOST;
const DATABRICKS_TOKEN = process.env.DATABRICKS_TOKEN;
const WAREHOUSE_ID = process.env.DATABRICKS_WAREHOUSE_ID;

async function runDatabricksQuery(sql) {
  const url = `https://${DATABRICKS_HOST}/api/2.0/sql/statements`;

  // Submit statement
  const submitRes = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DATABRICKS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      warehouse_id: WAREHOUSE_ID,
      statement: sql,
      wait_timeout: '50s',
      on_wait_timeout: 'CONTINUE',
    }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`Databricks submit failed: ${submitRes.status} ${text}`);
  }

  let data = await submitRes.json();

  // Poll until done (handles cold warehouse start)
  while (data.status?.state === 'PENDING' || data.status?.state === 'RUNNING') {
    await new Promise(r => setTimeout(r, 3000));
    const pollRes = await fetch(`${url}/${data.statement_id}`, {
      headers: { 'Authorization': `Bearer ${DATABRICKS_TOKEN}` },
    });
    if (!pollRes.ok) throw new Error(`Poll failed: ${pollRes.status}`);
    data = await pollRes.json();
  }

  if (data.status?.state !== 'SUCCEEDED') {
    throw new Error(`Query failed: ${JSON.stringify(data.status)}`);
  }

  return data;
}

app.post('/api/search', async (req, res) => {
  try {
    const brief = req.body;
    const { sql, limit } = buildSearchSQL(brief);

    console.log('Running query with limit', limit);
    const data = await runDatabricksQuery(sql);

    const schema = data.manifest?.schema || { columns: [] };
    const rows = data.result?.data_array || [];

    const allCustomers = transformRows(rows, schema);

    // De-duplicate: keep one row per location, preferring Owner over Manager
    const seen = new Map();
    for (const c of allCustomers) {
      const key = c._raw.location_id;
      if (!seen.has(key)) {
        seen.set(key, c);
      } else if (c._raw.role === 'Owner' && seen.get(key)._raw.role !== 'Owner') {
        seen.set(key, c);
      }
    }

    const deduped = Array.from(seen.values())
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, limit);

    const preview = deduped.slice(0, 2);
    const remaining = deduped.slice(2);

    res.json({
      summary: `Found ${deduped.length} customers matching your criteria.`,
      queryPreview: sql.split('\n').filter(l => l.trim()).slice(0, 8).join('\n'),
      totalMatches: deduped.length,
      previewCustomers: preview,
      remainingCustomers: remaining,
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/export', async (req, res) => {
  try {
    const { customers, brief } = req.body;
    if (!customers || customers.length === 0) {
      return res.status(400).json({ error: 'No customers to export' });
    }

    // Build CSV
    const headers = [
      'Role', 'First Name', 'Last Name', 'Email', 'Phone',
      'Location ID', 'Company ID', 'Location Name', 'Industry', 'Category',
      'City', 'State', 'Plan', 'Employees', 'Locations',
      'Tenure (months)', 'Active', 'Uses Scheduling', 'Uses Timecards',
      'Uses Messaging', 'Uses Hiring',
    ];

    const csvRows = customers.map(c => {
      const r = c._raw;
      return [
        r.role, r.first_name, r.last_name, r.email, r.phone || '',
        r.location_id, r.company_id, r.location_name, r.industry || '', r.category || '',
        r.city, r.state, r.plan,
        r.employees, r.locations, r.tenure_months,
        r.active, r.used_scheduling, r.used_timecards, r.used_messaging, r.used_hiring,
      ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...csvRows].join('\n');

    // Return CSV content for the frontend to handle
    res.json({ csv, filename: `Customer Research - ${brief?.goal?.slice(0, 40) || 'Export'} - ${new Date().toISOString().slice(0, 10)}.csv` });
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
