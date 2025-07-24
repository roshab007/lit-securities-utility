# Lit Securities Utility

A lightweight utility for initializing and searching through security master data using Web Workers.

---

## 📦 Installation

Install the package using `npm` or `yarn`:

```bash
npm install lit-securities-utility
```

or

```bash
yarn add lit-securities-utility
```

---

## 🚀 Usage

### 1. Initialize Security Master

Before using the search functionality, you must initialize the security master data.

```ts
import { initialize } from 'lit-securities-utility'

initialize(process.env.SEC_MASTER_URL, {
  requireSearchModule: true,
  onsuccess: () => {
    resolve()
  },
  onerror: error => {
    reject(error)
  }
})
```

### 2. Search Securities

Once initialized, you can search using the `searchManager` utility:

```ts
import { searchManager } from 'lit-securities-utility'

const handleSearch = async (searchString: string) => {
  const searchResult = await searchManager.search(searchString)
  console.log(searchResult) // Array of matched security objects
}

handleSearch('INFY')
```

---

## 🌐 Environment Variables

Make sure to define the `SEC_MASTER_URL` in your environment before using `initialize()`:

---

## 📄 License

MIT
