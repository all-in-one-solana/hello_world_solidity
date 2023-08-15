import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloWorldSolidity } from "../../target/types/hello_world_solidity";
import * as Web3 from '@solana/web3.js';
import * as fs from 'fs';
import dotenv from 'dotenv';
import * as toml from "toml";

dotenv.config();

async function main() {

  // 读取 anchor.toml 文件
  const fileContent = fs.readFileSync('../Anchor.toml', 'utf-8');

  // 解析 TOML 文件
  const config = toml.parse(fileContent);
  // console.log(config);

  // 从配置中获取 wallet_path
  const walletPath = config.provider.wallet;
  // console.log(walletPath);

  // 设置环境变量
  process.env.ANCHOR_WALLET = walletPath;

  const connection = new Web3.Connection("https://localhost:8899", "confirmed");
  const signer = await initializeKeypair(connection);

  console.log("Public key:", signer.publicKey.toBase58());
  // Configure the client to use the local cluster.

  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const dataAccount = anchor.web3.Keypair.generate();
  const wallet = provider.wallet;

  const program = anchor.workspace.HelloWorldSolidity as Program<HelloWorldSolidity>;

  // Add your test here.
  // const transactionSignature = await program.methods.initialize().rpc();
  const tx = await program.methods.new(wallet.publicKey)
    .accounts({ dataAccount: dataAccount.publicKey })
    .signers([dataAccount]).rpc();

  console.log(
    `Transaction https://solana.fm/tx/${tx}?cluster=devnet-qn1`
  )

  const val1 = await program.methods.get()
    .accounts({ dataAccount: dataAccount.publicKey })
    .view();

  console.log("state", val1);

  await program.methods.flip()
    .accounts({ dataAccount: dataAccount.publicKey })
    .rpc();

  const val2 = await program.methods.get()
    .accounts({ dataAccount: dataAccount.publicKey })
    .view();

  console.log("state", val2);

}

main()
  .then(() => {
    console.log("Finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })

async function initializeKeypair(_connection: Web3.Connection): Promise<Web3.Keypair> {
  if (!process.env.PRIVATE_KEY) {
    console.log('Generating new keypair... 🗝️');
    const signer = Web3.Keypair.generate();

    console.log('Creating .env file');
    fs.writeFileSync('.env', `PRIVATE_KEY=[${signer.secretKey.toString()}]`);

    return signer;
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY ?? '') as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecret = Web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecret;
}
