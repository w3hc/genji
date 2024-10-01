import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { address } = req.body

  if (!address) {
    return res.status(400).json({ message: 'Address is required' })
  }

  try {
    const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
    const pKey = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY

    if (!pKey) {
      throw new Error('Faucet private key is not set')
    }

    const specialSigner = new ethers.Wallet(pKey, customProvider)
    const tx = await specialSigner.sendTransaction({
      to: address,
      value: ethers.parseEther('0.01'),
    })

    let receipt: ethers.TransactionReceipt | null = null
    try {
      receipt = await tx.wait(1)
    } catch (waitError) {
      console.error('Error waiting for transaction:', waitError)
      return res.status(500).json({ message: 'Transaction failed or was reverted' })
    }

    if (receipt === null) {
      return res.status(500).json({ message: 'Transaction was not mined within the expected time' })
    }

    res.status(200).json({
      message: 'Faucet transaction successful',
      txHash: receipt.hash,
    })
  } catch (error) {
    console.error('Faucet error:', error)
    if (error instanceof Error) {
      return res.status(500).json({ message: `Internal server error: ${error.message}` })
    }
    res.status(500).json({ message: 'Internal server error' })
  }
}
