import { initializeKeypair } from './initializeKeypair'
import * as token from '@solana/spl-token'
import * as web3 from '@solana/web3.js'


// Creating new mintable tokens
async function createNewmint(
    connection: web3.Connection,
    payer: web3.Keypair,
    mintAuthority: web3.PublicKey,
    freezeAuthority: web3.PublicKey,
    decimals: number
): Promise<web3.PublicKey> {
    const tokenMint = await token.createMint(
        connection,
        payer,
        mintAuthority,
        freezeAuthority,
        decimals,
    )

    console.log(`Token Mint Address ☑️
        Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet
    `);
    
    return tokenMint;
}


// Now that we've created the mint, lets create a new Token Account, specifying the user as the owner.
// The createAccount function creates a new Token Account with the option to specify the address of the Token Account. 
// Recall that if no address is provided, createAccount will default to using the associated token account derived 
// using the mint and owner. Alternatively, the function createAssociatedTokenAccount will also create an associated 
// token account with the same address derived from the mint and owner public keys. For our demo we’ll use 
// thegetOrCreateAssociatedTokenAccount function to create our token account. This function gets the address of a 
// Token Account if it already exists. If it doesn't, it will create a new Associated Token Account at the appropriate address.
async function createTokenAccount(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    owner: web3.PublicKey
) {
    const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        owner
    )

    console.log(`
        Token Account: https://explorer.solana.com/address/${tokenAccount.address}/?cluster=devnet
    `);
    
    return tokenAccount
}


// After creating the new mint, let's fetch the account data using the getMint function and store it in a variable 
// called mintInfo. We'll use this data later to adjust input amount for the decimal precision of the mint.
async function main() {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
    const user = await initializeKeypair(connection)

    const mint = await createNewmint(
        connection,
        user,
        user.PublicKey,
        user.PublicKey,
        2
    )

    const mintInfo = await token.getMint(connection, mint);
}