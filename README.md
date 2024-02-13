# SPL Token Minting

This repository contains code snippets and explanations for creating and interacting with mintable tokens on the Solana blockchain using the SPL Token program. The provided code demonstrates various operations such as creating a new mint, creating a token account, minting tokens, approving delegates, transferring tokens, revoking delegates, and burning tokens.

## Code Overview

### Initialization

- `initializeKeypair`: Initializes a new keypair for Solana wallet interactions.

### Token Mint Operations

- `createNewmint`: Creates a new mintable token.
- `createTokenAccount`: Creates a new token account associated with a specific mint.
- `mintTokens`: Mints tokens to a specified token account.
- `approveDelegate`: Authorizes a delegate to transfer tokens on behalf of the owner.
- `transferTokens`: Transfers tokens from one token account to another.
- `revokeDelegate`: Revokes a delegate's authority to transfer tokens.
- `burnTokens`: Burns tokens to remove them from circulation.

### Main Function

- `main`: Orchestrates the token minting process, including creating a new mint, initializing token accounts, minting tokens, approving delegates, transferring tokens, revoking delegates, and burning tokens.

## Getting Started

1. Clone the repository.
   ```
   git clone https://github.com/ShivankK26/SPL-Token-Minting
   ```
2. Install dependencies using `npm install`.
3. Replace placeholder values and customize the code as needed.
4. Execute the `main` function to perform token minting operations.

## Dependencies

- `@solana/web3.js`: Solana JavaScript API for interacting with the Solana blockchain.
- `@solana/spl-token`: SPL Token program for managing token minting, transfers, and other token operations.

## Usage

Ensure that you have a valid Solana wallet configured and connected to the Solana network. Adjust the code parameters and execute the `main` function to perform token minting operations.
