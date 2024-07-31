import * as React from 'react'
import { Text, Button, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { BrowserProvider, Contract, Eip1193Provider, parseEther } from 'ethers'
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI } from '../utils/erc20'
import { LinkComponent } from '../components/layout/LinkComponent'
import { HeadingComponent } from '../components/layout/HeadingComponent'
import { ethers } from 'ethers'
import { Head } from '../components/layout/Head'
import { SITE_NAME, SITE_DESCRIPTION } from '../utils/config'

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [txLink, setTxLink] = useState<string>()
  const [txHash, setTxHash] = useState<string>()

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const provider: Eip1193Provider | undefined = walletProvider
  const toast = useToast()

  const getBal = async () => {
    if (isConnected) {
      const ethersProvider = new BrowserProvider(provider as any)
      const signer = await ethersProvider.getSigner()
      const balance = await ethersProvider.getBalance(address as any)
      const ethBalance = ethers.formatEther(balance)
      if (ethBalance !== '0') {
        return Number(ethBalance)
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  const faucetTx = async () => {
    const customProvider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_ENDPOINT_URL)
    const pKey = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY || ''
    const specialSigner = new ethers.Wallet(pKey, customProvider)
    const tx = await specialSigner.sendTransaction({
      to: address,
      value: parseEther('0.0007'),
    })
    const receipt = await tx.wait(1)
    return receipt
  }

  const doSomething = async () => {
    try {
      if (!isConnected) {
        toast({
          title: 'Not connected yet',
          description: 'Please connect your wallet, my friend.',
          status: 'error',
          position: 'bottom',
          variant: 'subtle',
          duration: 9000,
          isClosable: true,
        })
        return
      }
      let signer
      if (provider) {
        setIsLoading(true)
        setTxHash('')
        setTxLink('')
        const ethersProvider = new BrowserProvider(provider)
        signer = await ethersProvider.getSigner()

        ///// Send ETH if needed /////
        const bal = await getBal()
        console.log('bal:', bal)
        if (bal < 0.0007) {
          const faucet = await faucetTx()
          console.log('faucet tx', faucet)
        }

        ///// Call /////
        const erc20 = new Contract(ERC20_CONTRACT_ADDRESS, ERC20_CONTRACT_ABI, signer)
        const call = await erc20.mint(parseEther('10000'))
        const receipt = await call.wait()

        console.log('tx:', receipt)
        setTxHash(receipt.hash)
        setTxLink('https://sepolia.etherscan.io/tx/' + receipt.hash)
        setIsLoading(false)
        toast({
          title: 'Successful tx',
          description: 'Well done! 🎉',
          status: 'success',
          position: 'bottom',
          variant: 'subtle',
          duration: 20000,
          isClosable: true,
        })
      }
    } catch (e) {
      setIsLoading(false)
      console.log('error:', e)
      toast({
        title: 'Woops',
        description: 'Something went wrong...',
        status: 'error',
        position: 'bottom',
        variant: 'subtle',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Head title={SITE_NAME} description={SITE_DESCRIPTION} />
      <main>
        <Button
          colorScheme="blue"
          variant="outline"
          type="submit"
          onClick={doSomething}
          isLoading={isLoading}
          loadingText="Minting..."
          spinnerPlacement="end">
          Mint
        </Button>
        {txHash && (
          <Text py={4} fontSize="14px" color="#45a2f8">
            <LinkComponent href={txLink ? txLink : ''}>{txHash}</LinkComponent>
          </Text>
        )}
      </main>
    </>
  )
}
