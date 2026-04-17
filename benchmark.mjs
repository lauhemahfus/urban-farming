import autocannon from 'autocannon';
import fs from 'fs';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

const BENCHMARK_EMAIL = process.env.BENCHMARK_EMAIL || 'admin@example.com';
const BENCHMARK_PASSWORD = process.env.BENCHMARK_PASSWORD || 'admin@123';
const BENCHMARK_TOKEN = process.env.BENCHMARK_TOKEN || '';

async function getAuthToken() {
  if (BENCHMARK_TOKEN) return BENCHMARK_TOKEN;
  
  console.log('Retrieving authentication token for benchmark tests...');
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: BENCHMARK_EMAIL,
        password: BENCHMARK_PASSWORD
      })
    });
    const data = await response.json();
    return data?.data?.accessToken || '';
  } catch (error) {
    console.warn('Failed to retrieve authentication token. Authenticated endpoints may return 401.');
    return '';
  }
}

async function runBenchmark() {
  console.log(`Starting API Benchmark using Autocannon against ${BASE_URL}...\n`);
  
  const token = await getAuthToken();
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const endpoints = [
    {
      name: 'Health Check',
      url: `${BASE_URL}/health`,
      method: 'GET',
    },
    {
      name: 'List Produce (Pagination)',
      url: `${BASE_URL}/produce?page=1&limit=10`,
      method: 'GET',
    },
    {
      name: 'List Produce (No Pagination)',
      url: `${BASE_URL}/produce`,
      method: 'GET',
    },
    {
      name: 'List Rental Spaces',
      url: `${BASE_URL}/rentals?page=1&limit=10`,
      method: 'GET',
    },
    {
      name: 'List Community Posts (Pagination)',
      url: `${BASE_URL}/community/posts?page=1&limit=10`,
      method: 'GET',
    },
    {
      name: 'List Community Posts (No Pagination)',
      url: `${BASE_URL}/community/posts`,
      method: 'GET',
    },
    {
      name: 'Login User (Auth)',
      url: `${BASE_URL}/auth/login`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: BENCHMARK_EMAIL,
        password: BENCHMARK_PASSWORD
      })
    },
    {
      name: 'Get Admin Profile / Dashboard',
      url: `${BASE_URL}/admin/dashboard`,
      method: 'GET',
      headers: authHeaders
    },
    {
      name: 'Search Produce (Location & Radius)',
      url: `${BASE_URL}/produce?latitude=40.7128&longitude=-74.0060&radius=50`,
      method: 'GET',
    },
    {
      name: 'Create Community Post',
      url: `${BASE_URL}/community/posts`,
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Load Test Community Post',
        content: 'This post is automatically generated to benchmark the POST /community/posts endpoint speed.',
        tags: ['benchmark', 'test', 'load']
      })
    }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    console.log(`Benchmarking: ${endpoint.name} [${endpoint.method}] ${endpoint.url}`);
    
    const result = await autocannon({
      url: endpoint.url,
      method: endpoint.method,
      headers: endpoint.headers,
      body: endpoint.body,
      connections: 20, // Reduced to prevent Free-Tier PostgreSQL connection exhaustion
      pipelining: 1,   // Reduced to prevent Prisma Pool timeouts mapping 500 requests at once
      duration: 10     // Benchmark duration in seconds
    });

    results.push({
      Target: endpoint.name,
      Method: endpoint.method,
      'Min Time': `${result.latency.min} ms`,
      'Max Time': `${result.latency.max} ms`,
      'Avg Time': `${result.latency.average} ms`,
      'Total Req': result.requests.total,
      'Errors': result.errors,
      'Timeouts': result.timeouts
    });
    
    console.log(`Finished: ${endpoint.name}\n`);
  }

  console.log('====== FINAL BENCHMARK REPORT ======');
  console.table(results);

  // Save the report to a JSON file format
  fs.writeFileSync('benchmark-report.json', JSON.stringify(results, null, 2));
  console.log('Report saved to benchmark-report.json');
}

runBenchmark().catch(console.error);
