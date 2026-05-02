---
title: Word Embeddings
order: 1
---

# Word Embeddings

The first idea that made deep learning workable for language: represent each word as a dense vector in $\mathbb{R}^d$ such that geometric structure (cosine similarity, vector arithmetic) reflects semantic structure. Modern LLMs still begin with an embedding lookup; only the way we *learn* it has changed.

## The skip-gram intuition

Given a corpus, slide a window of size $k$ over each token $w_t$. The **skip-gram** objective trains an embedding $v_w$ such that, for every center–context pair $(w_t, w_{t+j})$ with $|j| \le k$, $j \ne 0$:

$$
\Pr(w_{t+j} \mid w_t) \;=\; \frac{\exp(v_{w_{t+j}}^\top v_{w_t})}{\sum_{w'} \exp(v_{w'}^\top v_{w_t})}.
$$

Maximising the log-likelihood over the corpus pulls together the embeddings of words that share contexts ("you shall know a word by the company it keeps").

## Negative sampling

The denominator above sums over the entire vocabulary — too expensive. Word2Vec replaces the full softmax with a binary classifier that distinguishes a true context word from $k$ noise words sampled from a unigram distribution $p(w)^{3/4}$:

$$
\log \sigma(v_{w_O}^\top v_{w_I}) + \sum_{i=1}^k \mathbb{E}_{w_n \sim p(w)^{3/4}}\bigl[\log \sigma(-v_{w_n}^\top v_{w_I})\bigr].
$$

This is the actual loss in Mikolov et al. and what made training tractable on billion-token corpora.

## Subword embeddings (fastText)

A serious limitation of Word2Vec: each word is opaque. *playing* and *plays* have unrelated embeddings if either is rare. **fastText** decomposes each word into character $n$-grams and represents the word as the sum of its $n$-gram embeddings:

$$
v_w \;=\; \sum_{g \in \mathcal{G}(w)} z_g.
$$

This generalises to out-of-vocabulary words and dramatically improves morphologically rich languages.

## Linear analogies

A famous side-effect: $v_{\text{king}} - v_{\text{man}} + v_{\text{woman}} \approx v_{\text{queen}}$. The embedding space encodes relations as nearly-linear translations — a property exploited by every probing study of modern LLMs.

## Why this still matters

Modern subword tokenizers (BPE, WordPiece) and the embedding tables they index are direct descendants of fastText's subword idea. Every LLM today still starts with `embedding[token_id]`.

## Reading list

- *Distributed Representations of Words and Phrases and their Compositionality* — Mikolov et al., 2013 (Word2Vec, skip-gram + negative sampling).
- *Enriching Word Vectors with Subword Information* — Bojanowski et al., 2017 (fastText).
- *Attention Is All You Need* — Vaswani et al., 2017 — covered next under [The Transformer](./transformer).

## What to read next

- [The Transformer](./transformer) — the architecture that replaced bag-of-context with learned attention.
