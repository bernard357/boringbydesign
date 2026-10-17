---
state: production
title: A frugal building block for semantic search
date: 2026-10-17
tags: [agentic, duckdb, semantic-search, frugal]
excerpt: Give a specialized agent fast, offline semantic search over a few thousand documents by baking a DuckDB file into its container — no external vector database.
---

# A frugal building block for semantic search

![Two ways to add semantic search to an agent: the usual external vector database with a network round trip, versus a DuckDB file baked into the agent's own container.](/duckdb-vectors-hero.svg)

Most agents we build at work are specialists, not oracles. A support agent that
answers from a few thousand policy pages. A tool-selection agent that picks the
right skill out of a few hundred. The honest need is small: semantic search over
a modest, mostly-static corpus. Yet the reflex answer is large — stand up a
vector database, run it as a service, wire the agent to it over the network. For
a few thousand documents, that is a lot of moving parts to own, pay for, and
keep alive. We wondered if there was a more boring path.

__In short:__ for the common case — a few thousand documents, read-mostly,
packaged with one agent — you can skip the external vector database entirely.
Index the corpus into a single [DuckDB](https://duckdb.org) file, bake that file
into the agent's container image, and answer semantic queries with a local
function call in tens of milliseconds. We packaged this pattern as
[`duckdb-vectors`](https://pypi.org/project/duckdb-vectors/), a small open-source
Python library.

## The problem, in concrete terms

A vector database earns its keep at scale: millions of vectors, high write
throughput, many concurrent clients, horizontal sharding. A specialized
enterprise agent usually has none of those. Its corpus fits in memory, changes
rarely, and is read far more often than written. Provisioning a networked
service for that workload adds latency (a round trip per query), operational
surface (another thing to deploy, secure, and monitor), and cost — all to serve
data that could travel with the agent itself.

The question is not "what is the most capable vector store" but "what is the
least machinery that answers this agent's queries well." For the modest case,
the answer can be a file.

## What we did

`duckdb-vectors` treats one DuckDB file as one search index. The flow is three
steps:

1. chunk your documents and store their embeddings in a DuckDB database
2. bake the database into the container that packages your agent
3. search semantically with vector distance and exact-token matching, in tens of
   milliseconds

Indexing a folder of Markdown is a command away, and querying is a few lines
from the agent's own code:

```shell
$ pip install duckdb-vectors
$ duckdb-vectors index ./docs            # build vectors.duckdb from a folder
$ duckdb-vectors search "my question"    # hybrid search from the CLI
```

```python
from duckdb_vectors import VectorStore

store = VectorStore()

for hit in store.query("how does an embedded database work?", top_k=3):
    print(hit.score, hit.chunk.chunk_id, hit.chunk.text)
```

The default install is batteries-included: a local embedding model and the CLI
work out of the box, so the first run needs no cloud account and no extra setup.

## How it leans on DuckDB

The library is deliberately thin because DuckDB does the heavy lifting. Each
query runs two signals and fuses them with reciprocal rank fusion: a vector
distance over embedding arrays for meaning, and an exact-token match for the
short literal strings that vectors handle poorly — acronyms, product codes,
identifiers. The lexical index is built without stemming or stopwords on
purpose, so `ESRS` finds `ESRS` while staying language-agnostic; semantic search
already covers paraphrase and synonyms across languages, so stemming adds cost
without adding relevance for this use case.

Chunking leans on the DuckDB `markdown` community extension to split documents
into heading-scoped sections, and embeddings live in native `ARRAY` columns.
Choosing one backend on purpose — rather than a lowest-common-denominator
abstraction over many databases — is what lets the library stay small and lean
on these DuckDB-specific features. It is a bet on
[boring technology](https://mcfunley.com/choose-boring-technology): proven parts,
predictable behaviour, few surprises.

## Baking it into the agent

The serving story is the point. The CLI builds `vectors.duckdb` at image-build
time; at run time the container opens that file read-only and never writes to
it. There is no separate data service to deploy alongside the agent and no
network hop on the query path — the index ships inside the same artifact as the
code, which is how modern agents are packaged anyway.

The embedding backend is selected by a string, so the same code runs offline in
CI with a local model and against a cloud provider in production. Amazon Bedrock
Titan is built in for teams already on AWS, and we exercised the whole thing
end-to-end as a container, as an AWS Lambda function, and on Amazon Bedrock
AgentCore. The library sits comfortably inside an agent harness — it does one
thing (retrieval) and leaves generation and orchestration to the framework.

## Where it fits — and where it does not

This is a scoped contribution, not a universal store. It fits when the corpus is
in the thousands of items, mostly static, and travels with a single agent, and
when a local function call beating a network round trip matters more than
elastic write throughput. It does __not__ replace a managed vector database for
large multi-tenant corpora, high-churn write workloads, or sustained
high-concurrency serving. Naming the boundary is part of the pitch: the smaller
scope is exactly what buys the simplicity.

The mismatch is easiest to see side by side:

| Topic | A managed vector database | duckdb-vectors |
| --- | --- | --- |
| Corpus size | millions of vectors, sharded | a few thousand items, in one file |
| Write pattern | high-churn, live updates | read-mostly, re-indexed on build |
| Deployment | a separate service to run | a file baked into the agent image |
| Query path | network round trip | local call, tens of milliseconds |
| Concurrency | many services, high QPS | one agent reading its own index |
| You operate | deploy, secure, monitor, pay | `pip install` |

Pick the left column when you genuinely have that scale. For the right column —
the common specialized agent — the left column is machinery you do not need yet.

## What to take away

For the normal enterprise agent, semantic search does not have to mean operating
a vector database. A single DuckDB file, baked into the container, covers the
common case with less machinery to own. If that shape matches something you are
building, `duckdb-vectors` is open source and
[one `pip install` away](https://pypi.org/project/duckdb-vectors/).

It is also built to be extended: both the embedding backends and the chunkers
sit behind small registries, so adding one is a short, self-contained
contribution:

```python
from duckdb_vectors import register_chunker

register_chunker("mychunker", lambda variant: MyChunker(variant))
```

Pull requests that add a backend or a chunker are especially welcome.

## Further reading

- [duckdb-vectors on PyPI](https://pypi.org/project/duckdb-vectors/) and the [source on GitHub](https://github.com/bernard357/duckdb-vectors)
- [DuckDB](https://duckdb.org) and its [vector similarity search extension](https://duckdb.org/docs/current/core_extensions/vss.html)
- [Choose Boring Technology](https://mcfunley.com/choose-boring-technology) — the principle this is built on
- Written by Bernard Paques, who builds frugal agentic systems and writes about staying boring through the agentic revolution.
