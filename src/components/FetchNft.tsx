import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { FC, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"

export const FetchNft: FC = () => {
  const [nftData,setNftData] = useState(null)
  const {connection} = useConnection()
  const wallet = useWallet()
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))

  const fetchNfts = async () => {
    if(!wallet.connected){
      return
    }
    const nfts = await metaplex.nfts().findAllByOwner({owner:wallet.publicKey})
    //fetch off chain meta data
    let nft_data = []
    for(let i =0;i<nfts.length;i++)
    {
      let fetch_result = await fetch(nfts[i].uri)
      let json = await fetch_result.json()
      nft_data.push(json)
    }
    setNftData(nft_data)
  }
  useEffect(()=>{
    fetchNfts()
  },[wallet])

  return (
  <div  className={styles.gridNFT}>
    {nftData && (
      <div>
        {nftData.map((nft: { name: boolean | ReactChild | ReactFragment | ReactPortal; image: string; symbol: boolean | ReactChild | ReactFragment | ReactPortal })=>(
          <div>
            <ul>{nft.name}</ul>
            <img src={nft.image} alt="nft_image" />
            <p>{nft.symbol}</p>
          </div>
        ))}
      </div>
    )}

  </div>)
}
