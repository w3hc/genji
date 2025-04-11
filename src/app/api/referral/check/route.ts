import { NextRequest, NextResponse } from 'next/server'
import { ethers } from 'ethers'

// ReferralTracker contract ABI (only the methods we need for checking referrals)
const referralTrackerABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'referee',
        type: 'address',
      },
    ],
    name: 'referredBy',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

// Contract address on OP Sepolia
const CONTRACT_ADDRESS = '0x03917205bfef0692fae6e26dd87fcc7f96123af2'

export async function GET(request: NextRequest) {
  try {
    // Get the address from query parameters
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get('address')

    // Validate the address
    if (!address) {
      return NextResponse.json({ message: 'Address parameter is required' }, { status: 400 })
    }

    if (!ethers.isAddress(address)) {
      return NextResponse.json({ message: 'Invalid Ethereum address format' }, { status: 400 })
    }

    // Connect to OP Sepolia network
    const provider = new ethers.JsonRpcProvider('https://sepolia.optimism.io')

    // Create contract instance for read-only operations
    const contract = new ethers.Contract(CONTRACT_ADDRESS, referralTrackerABI, provider)

    // Check if the address has a referrer
    const referrer = await contract.referredBy(address)

    // If referrer is the zero address, the user isn't registered
    const isRegistered = referrer !== ethers.ZeroAddress

    return NextResponse.json({
      isRegistered,
      referrer: isRegistered ? referrer : null,
    })
  } catch (error) {
    console.error('Error checking referral status:', error)

    return NextResponse.json(
      { message: 'Failed to check referral status', error: String(error) },
      { status: 500 }
    )
  }
}
