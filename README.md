# Veronica-7

Project Veronica

Our goal is to bridge the gap for undergraduate with machine learning lessons to SOTA.

This is a continuing project of [NoteNextra](https://github.com/Trance-0/NoteNextra)

Due to some technical difficulties, I'm unable to continue my study with Machine learning this year, but I believe it is a perfect time to recap what I covered in the past few years and let time to carry me to the goal, becoming the top researchers in Machine Learning and best algorithm for extracting, predicting, and acting on the data to increase the efficiency of information transmission to the rate of human brain.

That is, free all human from repetitive labor, making everyone to achieve their design and contribute, interacting, learning from the world more effectively (with lower energy and time consumptions).

Making ideas freely flow between each others minds, helping people to express, achieve and realize their potentials and sharing their wish with each other.

---

## The site

Project Veronica is published as a [VitePress](https://vitepress.dev) static site, deployed to [Cloudflare Pages](https://pages.cloudflare.com).

### Local development

```bash
npm install
npm run docs:dev      # http://localhost:5173
```

### Build

```bash
npm run docs:build    # output: docs/.vitepress/dist
npm run docs:preview  # serve the built site
```

### Importing source content

The curriculum is bootstrapped from [Trance-0/NoteNextra](https://github.com/Trance-0/NoteNextra). Two scripts manage content:

```bash
npm run stubs    # create placeholder pages for every sidebar entry
npm run import   # fetch ML lectures from NoteNextra into the right sections
npm run scaffold # both, in order
```

`scripts/import-notenextra.mjs` contains the manifest mapping upstream
files to destination paths. Edit it to add or rearrange imports.

### Deploying to Cloudflare Pages

#### Option A — connect the repository (recommended)

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
2. Select this repo, branch `main`.
3. Build settings:
   - **Framework preset:** `VitePress`
   - **Build command:** `npm run docs:build`
   - **Build output directory:** `docs/.vitepress/dist`
   - **Node version:** `20`
4. Save and deploy. Cloudflare will pick up `wrangler.toml` automatically.

#### Option B — direct upload via Wrangler

```bash
npm run docs:build
npx wrangler login
npx wrangler pages deploy docs/.vitepress/dist --project-name Veronica-7
```

Or use the bundled npm shortcut: `npm run deploy`.

#### Option C — GitHub Actions

`.github/workflows/deploy.yml` will publish on every push to `main` once
the following repository secrets are set:

- `CLOUDFLARE_API_TOKEN` — Pages:Edit token
- `CLOUDFLARE_ACCOUNT_ID` — your account ID

## Repository layout

```text
.
├── docs/                          # VitePress source
│   ├── .vitepress/
│   │   ├── config.mts             # site config (nav, search, math, etc.)
│   │   └── sidebars/              # one file per top-level section
│   ├── public/
│   │   ├── _headers               # Cloudflare Pages cache headers
│   │   └── _redirects             # /notenextra/* → upstream GitHub
│   ├── index.md                   # home page
│   ├── about.md
│   ├── fundamentals/              # pre-DNN: math, classical algos, history
│   ├── dnn/                       # MLP → CNN → RNN → generative → RL
│   ├── cv/                        # CSE559A foundations + CSE5519 advances
│   ├── llm/                       # NLP foundations + modern LLM concepts
│   └── transformer-era/           # 2017 → present, chronological
├── scripts/
│   ├── generate-stubs.mjs         # create stub pages from sidebar configs
│   └── import-notenextra.mjs      # fetch upstream lectures into sections
├── .github/workflows/deploy.yml   # Cloudflare Pages CI
├── wrangler.toml                  # Pages project config
└── package.json
```

## Content credits

Lecture content imported from [NoteNextra](https://github.com/Trance-0/NoteNextra)
remains under its upstream license; each imported page links back to its source.
