import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// ReferralTracker contract ABI (only the methods we need)
const referralTrackerABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'referrer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'referee',
        type: 'address',
      },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

// Contract address on OP Sepolia
const CONTRACT_ADDRESS = '0x03917205bfef0692fae6e26dd87fcc7f96123af2'

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()
    const { referrer, referee } = body

    // Validate the input
    if (!referrer || !referee) {
      return NextResponse.json(
        { message: 'Both referrer and referee addresses are required' },
        { status: 400 }
      )
    }

    if (!ethers.isAddress(referrer) || !ethers.isAddress(referee)) {
      return NextResponse.json({ message: 'Invalid Ethereum address format' }, { status: 400 })
    }

    // Get the private key from environment variables
    const operatorPrivateKey = process.env.OPERATOR_PRIVATE_KEY
    if (!operatorPrivateKey) {
      console.error('OPERATOR_PRIVATE_KEY not found in environment variables')
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 })
    }

    // Connect to OP Sepolia network
    const provider = new ethers.JsonRpcProvider('https://sepolia.optimism.io')
    const wallet = new ethers.Wallet(operatorPrivateKey, provider)

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, referralTrackerABI, wallet)

    // Call the register function without waiting for confirmation
    const tx = await contract.register(referrer, referee)

    // Return the transaction hash immediately
    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      message: 'Referral transaction submitted',
    })
  } catch (error) {
    console.error('Error in referral registration:', error)

    // Extract meaningful error message
    let errorMessage = 'Failed to register referral'

    if (error instanceof Error) {
      // Check for specific contract errors
      if (error.message.includes('UserAlreadySignedUp')) {
        errorMessage = 'This address has already been registered with a referrer'
      } else if (error.message.includes('CannotReferSelf')) {
        errorMessage = 'You cannot refer yourself'
      } else if (error.message.includes('InvalidReferrerAddress')) {
        errorMessage = 'Invalid referrer address'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
