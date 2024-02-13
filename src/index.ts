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
        Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet
    `);
    
    return tokenAccount
}


// Now that we have a token mint and a token account, lets mint tokens to the token account. Note that only the 
// mintAuthority can mint new tokens to a token account. Recall that we set the user as the mintAuthority for the mint we 
// created. Create a function mintTokens that uses the spl-token function mintTo to mint tokens:
async function mintTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    destination: web3.PublicKey,
    authority: web3.Keypair,
    amount: number
) {
    const transactionSignature = await token.mintTo(
        connection,
        payer,
        mint,
        destination,
        authority,
        amount
    )

    console.log(`
        Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet
    `);
    
}


// Now that we have a token mint and a token account, lets authorize a delegate to transfer tokens on our behalf. 
// Create a function approveDelegate that uses the spl-token function approve to mint tokens:
async function approveDelegate(
    connection: web3.Connection,
    payer: web3.Keypair,
    account: web3.PublicKey,
    delegate: web3.PublicKey,
    owner: web3.Signer | web3.PublicKey,
    amount: number
) {
    const transactionSignature = await token.approve(
        connection,
        payer,
        account,
        delegate,
        owner,
        amount
    )

    console.log(`
        Approve Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet
    `);
}


//
async function transferTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    source: web3.PublicKey,
    destination: web3.PublicKey,
    owner: web3.Keypair,
    amount: number
) {
    const transactionSignature = await token.transfer(
        connection,
        payer,
        source,
        destination,
        owner,
        amount
    )

    console.log(`
        Transfer Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet
    `);
    
}


// Now that we've finished transferring tokens, lets revoke the delegate using the spl-token library's revoke function.
async function revokeDelegate(
    connection: web3.Connection,
    payer: web3.Keypair,
    account: web3.PublicKey,
    owner: web3.Signer | web3.PublicKey
) {
    const transactionSignature = await token.revoke(
        connection,
        payer,
        account,
        owner
    )

    console.log(`
        Revote Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet
    `);
    
}


// Finally, let's remove some tokens from circulation by burning them.
async function burnTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    account: web3.PublicKey,
    mint: web3.PublicKey,
    owner: web3.Keypair,
    amount: number 
) {
    const transactionSignature = await token.burn(
        connection,
        payer,
        account,
        mint, 
        owner,
        amount
    )

    console.log(`
        Burn Transaction: https://explorer.solana.com/ts/${transactionSignature}?cluster=devnet
    `);
    
}


// After creating the new mint, let's fetch the account data using the getMint function and store it in a variable 
// called mintInfo. We'll use this data later to adjust input amount for the decimal precision of the mint.
async function main() {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
    const user = await initializeKeypair(connection)

    const mint = await createNewmint(
        connection,
        user,
        user.publicKey,
        user.publicKey,
        2
    )

    const mintInfo = await token.getMint(connection, mint);


    // Add a call the createTokenAccount in main, passing in the mint we created in the previous step and setting the user as the payer and owner.
    const tokenAccount = await createTokenAccount(
        connection,
        user,
        mint,
        user.publicKey
    )


    // Note that we have to adjust the input amount for the decimal precision of the mint. Tokens from our mint have 
    // a decimal precision of 2. If we only specify 100 as the input amount, then only 1 token will be minted to our token account.
    await mintTokens(
        connection,
        user,
        mint,
        tokenAccount.address,
        user,
        100 * 10 ** mintInfo.decimals
    )


    const receiver = web3.Keypair.generate().publicKey
    const receiverTokenAccount = await createTokenAccount(
        connection,
        user,
        mint,
        receiver
    )


    // In main, lets generate a new Keypair to represent the delegate account. Then, lets call our new approveDelegate 
    // function and authorize the delegate to tranfer up to 50 tokens from the user token account. Remember to adjust 
    // the amount for the decimal precision of the mint.
    const delegate = web3.Keypair.generate();

    await approveDelegate(
        connection,
        user,
        tokenAccount.address,
        delegate.publicKey,
        user.publicKey,
        50 * 10 ** mintInfo.decimals
    )


    // In main, lets generate a new Keypair to be the receiver (but remember that this is just to simulate having 
    // someone to send tokens to - in a real application you'd need to know the wallet address of the person 
    // receiving the tokens). Then, create a token account for the receiver. Finally, lets call our new transferTokens 
    // function to transfer tokens from the user token account to the receiver token account. We'll use the delegate 
    // we approved in the previous step to perform the transfer on our behalf.
    await transferTokens(
        connection,
        user,
        tokenAccount.address,
        receiverTokenAccount.address,
        delegate,
        50 * 10 ** mintInfo.decimals
    )


    // Revoke will set delegate for the token account to null and reset the delegated amount to 0. All we will need 
    // for this function is the token account and user. Lets call our new revokeDelegate function to revoke the 
    // delegate from the user token account.
    await revokeDelegate(
        connection,
        user,
        tokenAccount.address,
        user.publicKey
    )


    // Now call this new function in main to burn 25 of the user's tokens. Remember to adjust the amount for the decimal precision of the mint.
    await burnTokens(
        connection,
        user,
        tokenAccount.address,
        mint, 
        user,
        25 * 10 ** mintInfo.decimals
    )
}