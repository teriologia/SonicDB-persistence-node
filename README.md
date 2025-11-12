# @teriologia/sonicdb-persistence-node

**Persistence Plugin for Node.js Environments (Filesystem Persistence)**

`@teriologia/sonicdb-persistence-node` adds reliable disk persistence capabilities to the **SonicDB** core in-memory database engine when running in Node.js environments.

This plugin writes and reads data using Node.js's built-in `fs` (File System) module, ensuring a simple, robust, and zero-dependency solution for data reliability.

---

## ✨ Features and Philosophy

* **Zero External Dependencies:** Built solely on Node.js's native `fs` module, ensuring minimal footprint and maximum stability.
* **Reliable Persistence:** Uses a full JSON file dump for crash-safe data saving.
* **Easy Integration:** Integrated with a single line using the `SonicDB`'s core plugin system (`usePersistence()`).
* **Optimized I/O:** Designed for manual saves (`db.save()`) to let the developer control disk write frequency, preventing performance bottlenecks in high-throughput applications.

---

## 🚀 Installation

This package is a plugin and requires the core `SonicDB` motor to function. Install both packages:

```bash
npm install @teriologia/sonicdb @teriologia/sonicdb-persistence-node
```

---
## ⚠️ Developer Note: When to Save

**Best Practice**: This plugin does not auto-save on every create, update, or delete operation. This is an intentional design choice to maintain the high performance of the core engine.

 For production use, you should decide when to save based on your application's needs:

*  **Periodically**: Use setInterval to call db.save() every few seconds.

*  **After Bulk Operations**: Call db.save() once after a batch of data has been imported or modified.

*  **On Server Shutdown**: Ensure db.save() is called when your Node.js process receives a termination signal (SIGINT, SIGTERM).
---

## 👨‍💻 How to Use (Node.js Example)

**Step 1: Initialize, Use Plugin, and Load Data**

The loadPersistentData() method is crucial as it reads the existing file from disk and rebuilds the in-memory indexes of SonicDB.

```typescript
  const persistencePlugin = new NodeFSPersistence('users.json');
    
  const db = new SonicDB({ indexOn: ['email'] });
  db.usePersistence(persistencePlugin); 

  // Load Existing Data
  // Returns true if data was found and successfully loaded, false otherwise.
  await db.loadPersistentData();
```

**Step 2: Save Data**

Manually Save (Critical Step!)

```typescript
  await db.save();
```

**Advanced Configuration: Specifying the Data Path**

If you need to store the data file in a custom directory (e.g., outside the project root), use the basePath option:

```typescript
  const path = require('path');
  const fs = require('fs');

  const dataDir = path.join(__dirname, 'data_store'); 
  if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir); // Ensure the folder exists
  }

  const customPlugin = new NodeFSPersistence('app_data.json', { 
      basePath: dataDir 
  });
```
