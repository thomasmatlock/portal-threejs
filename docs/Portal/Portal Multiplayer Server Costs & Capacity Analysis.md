# Portal Multiplayer Server Costs & Capacity Analysis

## Server Options Comparison

### Colyseus Hosting (Managed)

|Tier|Specs|Price|CCU (Moderate)|DAU|Notes|
|---|---|---|---|---|---|
|Low Performance|1 vCPU, 1GB RAM|$12.50/mo|500|48,000|Managed service|
|Low Performance|2 vCPU, 2GB RAM|$37.50/mo|1,000|96,000|Good starter option|

### Hetzner Self-Hosted (Recommended)

|Model|Specs|Price|CCU (Portal)|DAU|Notes|
|---|---|---|---|---|---|
|**CPX11**|2 vCPU, 2GB RAM|**$4.99/mo**|3,000-6,000|288k-576k|Best value|
|CPX21|3 vCPU, 4GB RAM|$9.99/mo|6,000-12,000|576k-1.1M|Scale-up option|
|CPX31|4 vCPU, 8GB RAM|$17.99/mo|12,000-24,000|1.1M-2.3M|High traffic|

## Why Portal is "Minimal CPU Usage"

### What You're Syncing (Simple)

- Player positions/rotations (12 floats)
- Portal positions (24 floats per pair)
- Cube/button states (booleans)
- Simple physics objects

### What You're NOT Doing (CPU Heavy)

- ❌ No AI/NPCs calculations
- ❌ No combat computations
- ❌ No procedural generation
- ❌ No massive world simulation
- ✅ Physics runs on server, clients receive results

## Capacity Estimates for CPX11 ($4.99/mo)

### Conservative Reality

- **100-500 concurrent users** = Successful indie game
- **10-50 DAU** = Great for portfolio/awards
- Uses ~2% of server capacity

### Actual Capacity

- **3,000-6,000 concurrent users**
- **288,000-576,000 daily active users**
- **8.6M-17.2M monthly active users**

### Context

- Portal 2 averages 2-3k concurrent on Steam
- Your $5 server could handle all of them
- Among Us peaked at 500k concurrent
- You could handle 1% of that for beer money

## Architecture for Scale

```
CLIENT (Browser)
├── React Three Fiber (rendering)
├── Sends inputs to server
└── Receives state updates

SERVER (Hetzner CPX11)
├── Colyseus (room management)
├── Rapier (physics simulation)
└── Broadcasts authoritative state
```

## Cost Efficiency Breakdown

|Metric|Value|
|---|---|
|Server Cost|$4.99/month|
|Potential DAU|576,000|
|**Cost per DAU**|**$0.0000086**|
|Cost per 1000 DAU|$0.0086|

## Recommendation

**Start with Hetzner CPX11 ($4.99/mo)**

- Massive headroom for growth
- 100x more capacity than you'll likely need
- Cheaper than Discord Nitro
- Can handle viral success

**Upgrade path if needed:**

1. CPX11 → CPX21 at 1,000+ concurrent
2. CPX21 → CPX31 at 5,000+ concurrent
3. Add load balancer at 10,000+ concurrent