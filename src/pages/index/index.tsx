import React, { useEffect } from 'react'
import './index.css'
import { useTranslation } from 'react-i18next'
import { ConnectState, useEasyWeb3 } from '@/service/web3'
import { ethers } from 'ethers'
import { DAI_CONTRACT } from '@/service/web3/constants/contract-test'

const toAddress = '0x1CB0c4a453d73C11716F6448c4EdF23f27E79dab'

const Index = () => {
  const { t } = useTranslation()
  const { connectState, easyWeb3, walletInfo } = useEasyWeb3()
  const getContract = () => {
    let erc20_rw: any = null
    if (easyWeb3.isConnected()) {
      if (walletInfo.chainId == 97) {
        const dai = DAI_CONTRACT[97]
        erc20_rw = new ethers.Contract(
          dai.address,
          dai.abi,
          easyWeb3.getSigner(),
        )
      } else {
        alert("Please switch to network 'ropsten'")
      }
    }
    return erc20_rw
  }
  const list = [
    {
      title: 'signer.signMessage()',
      func: async () => {
        const signer = easyWeb3.getSigner()
        if (signer) {
          // const signature = await signer.signMessage('Hello World')
          const message =
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
          const messageBytes = ethers.utils.arrayify(message)
          const signature = await signer.signMessage(messageBytes)
          alert(signature)
        }
      },
    },
    {
      title: 'signer.sendTransaction()',
      func: async () => {
        const signer = easyWeb3.getSigner()
        if (signer) {
          try {
            await signer.sendTransaction({
              to: toAddress,
              value: ethers.utils.parseEther('0.0001'),
            })
          } catch (error) {
            alert(error.message || JSON.stringify(error))
          }
        }
      },
    },
    {
      title: 'dai.balanceOf()',
      func: async () => {
        const dai = getContract()
        console.log(dai);
        if (dai) {
          const symbol = await dai.symbol()
          const rowBalance = await dai.balanceOf(walletInfo.address)
          alert(symbol + ': ' + rowBalance)
        }
      },
    },
    {
      title: 'dai.transfer()',
      func: async () => {
        const dai = getContract()
        if (dai) {
          const ret = await dai.transfer(toAddress,BigInt(1000000000000000000))
          alert('transfer: ' + JSON.stringify(ret))
        }
      },
    },
    {
      title: 'dai.approve()',
      func: async () => {
        const dai = getContract()
        // if (dai) {
        //   const ret = await dai.approve('0x1B57F938d2Eb1C3b31F837618Af2f16CA8Aa4C1d', 1000000000000000000)
        //   alert('approve: ' + JSON.stringify(ret))
        // }
        const ret = await dai.approve('0x1B57F938d2Eb1C3b31F837618Af2f16CA8Aa4C1d',BigInt(1000000000000000000));
      },
    },
  ]
  useEffect(() => {
    console.log('app created')
  }, [])
  return (
    <>
      {connectState == ConnectState.Connected && (
        <ul className="flex flex-col items-center pt-12">
          {list.map((item) => (
            <li
              className="my-2 btn bg-primary text-white px-6 py-2 rounded-full"
              key={item.title}
              onClick={item.func}
            >
              {item.title}
            </li>
          ))}
        </ul>
      )}
      {connectState == ConnectState.Disconnected && (
        <div className="flex items-center justify-center h-32 text-secondary">
          Please connect to wallet first.
        </div>
      )}
    </>
  )
}

export default Index
