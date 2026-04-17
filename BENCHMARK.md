# API Benchmark Report

## Overview
This document details the performance benchmark results for the Urban Farming API. The tests were executed using Autocannon to measure endpoint latency, throughput capability, and stability under synthetic concurrent load.

**Test Configuration:**
- **Duration:** 10 seconds per endpoint
- **Concurrent Connections:** 20
- **Pipelining:** 1


## Benchmark Results

| Target | Method | Min Time | Max Time | Avg Time | Total Requests | Errors | Timeouts |
|--------|--------|----------|----------|----------|----------------|--------|----------|
| Health Check | GET | 1 ms | 121 ms | 9.75 ms | 19,512 | 0 | 0 |
| List Produce (Pagination) | GET | 2034 ms | 7510 ms | 4808.36 ms | 39 | 0 | 0 |
| List Produce (No Pagination) | GET | 2253 ms | 4429 ms | 2999.39 ms | 59 | 0 | 0 |
| List Rental Spaces | GET | 1995 ms | 3877 ms | 2684.81 ms | 62 | 0 | 0 |
| List Community Posts (Pagination) | GET | 1840 ms | 3832 ms | 2595.34 ms | 68 | 0 | 0 |
| List Community Posts (No Pagination) | GET | 1951 ms | 4631 ms | 2882.57 ms | 60 | 0 | 0 |
| Login User (Auth) | POST | 1 ms | 2442 ms | 14.82 ms | 13,062 | 0 | 0 |
| Get Admin Profile / Dashboard | GET | 7 ms | 90 ms | 10.53 ms | 18,111 | 0 | 0 |
| Search Produce (Location & Radius) | GET | 1749 ms | 6842 ms | 3508.14 ms | 50 | 0 | 0 |
| Create Community Post | POST | 1 ms | 504 ms | 37.93 ms | 5,188 | 0 | 0 |

## Analysis

### High-Performing Endpoints
- **Health Checks & Direct Profile Lookups:** Exceedingly fast, processing between 18,000 and 19,500 requests with latencies averaging around 10 ms.
- **Authentication & Security:** The Login endpoint performed exceptionally well, handling over 13,000 requests at a steady 14.82 ms average, despite payload parsing and token generation.
- **Write Operations:** Form submissions such as building a Community Post effectively managed over 5,000 requests rapidly with an average time of 37.93 ms.


