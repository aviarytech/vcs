# VC Services

This repository contains Verifiable Credential Services for completing all of the required operations on VCs.

There are 3 services supplied by this library. They map to different roles in the ecosystem.

- Issuer
- Holder
- Verifier

This library is designed to be available to both browser and node environments.

The structure of this library maps to the [VC API](https://w3c-ccg.github.io/vc-api/)

## Issuer

- Issue VC
- Update VC Status

## Holder

- Derive VC
- Prove VP
- VP Availability?
- Submit VP

## Verifier

- Verify VC
- Verify VP

# Usage

Installation

```
  npm install @aviarytech/vcs
```

Issue Credential

- VC LD

```
  import { issuer } from "@aviarytech/vcs"

  const vc = await issuer.issueCredential()
```
