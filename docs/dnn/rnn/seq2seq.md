---
title: Sequence-to-Sequence
order: 3
---

# Sequence-to-Sequence

The sequence-to-sequence (seq2seq) framework maps an input sequence to an output sequence of *different* length, using one RNN to encode the input into a fixed vector and a second RNN to decode that vector into the output. It was introduced for machine translation, made neural translation viable, and is the structural ancestor of every encoder-decoder model since — including the original Transformer.

## The Sutskever–Vinyals–Le model

*Sequence to Sequence Learning with Neural Networks* (Sutskever, Vinyals, Le, NIPS 2014) defined the architecture:

1. An **encoder** RNN (a 4-layer LSTM in the original paper) reads the source sentence one token at a time, producing a final hidden state $\mathbf{c}$ — the **context vector**.
2. A **decoder** RNN, initialised from $\mathbf{c}$, generates the target sentence one token at a time, conditioning each step on the previous emitted token.

Mathematically, the decoder factorises the output distribution autoregressively:

$$
p(y_1, \dots, y_{T'} \mid x_1, \dots, x_T) \;=\; \prod_{t=1}^{T'} p(y_t \mid y_{<t}, \mathbf{c}).
$$

Trained end-to-end with cross-entropy loss on (source, target) pairs and beam search at inference time. The 2014 paper's English–French translation result was within a couple of BLEU points of the Moses statistical-MT system — the first proof that pure neural translation could work at scale.

## Two engineering tricks that mattered

The Sutskever et al. paper reported two non-obvious recipe details:

- **Reverse the source.** Feed the encoder $x_T, x_{T-1}, \dots, x_1$ instead of $x_1, \dots, x_T$. This puts the *first* source word closest to the encoder's final state — and so closest to the *first* decoder step — drastically improving learning of short-range alignments.
- **Multiple stacked LSTM layers.** Going from 1 to 4 layers gave most of the BLEU gain.

Both tricks became obsolete once attention was introduced — neither is a structural insight, both worked around the architecture's limits.

## Cho et al. — the simpler encoder-decoder

*Learning Phrase Representations using RNN Encoder–Decoder for Statistical Machine Translation* (Cho et al., EMNLP 2014) introduced essentially the same architecture, with the GRU as the recurrent cell. Cho et al. originally used the model as a *feature* for a hybrid statistical-MT system; Sutskever et al.'s contemporaneous work showed it could replace the entire MT pipeline.

## The bottleneck problem

The fixed-size context $\mathbf{c}$ is the architecture's central limitation. For short sentences this is fine — a 1024-d vector can encode a 20-word phrase. For long inputs, $\mathbf{c}$ becomes an information bottleneck: the encoder must compress all of "the news article" into a single vector, and the decoder must decode all of "the translation" from that one vector. BLEU drops on long sentences as a direct consequence.

The fix is [Bahdanau attention](./bahdanau-attention): rather than passing only $\mathbf{c}$, pass the *entire* sequence of encoder hidden states and let the decoder attend to whichever ones are relevant at each output step. This was the conceptual unlock that, three years later, the Transformer fully internalised.

## Beyond translation

The seq2seq framing generalises to almost any text-to-text task:

- **Summarisation** — long input, short output.
- **Dialogue** — context input, response output.
- **Question answering** — passage + question input, answer output.
- **Code generation** — natural-language input, code output.

The **T5** paper (Raffel et al., 2020) made this explicit: every NLP task is a seq2seq problem with a task prefix. The encoder–decoder design from 2014 is still the structural template for T5, BART, and most large translation models today.

## What to read next

- [Bahdanau Attention](./bahdanau-attention) — the attention mechanism that fixed the context bottleneck.
- [LSTM & GRU](./lstm-gru) — the recurrent cells these encoders/decoders use.
- [Transformer (LLM)](../../llm/basics/transformer) — the modern descendant.
