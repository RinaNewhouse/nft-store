'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import StripeCheckout from "../../components/StripeCheckout";
import { useCart } from "../../contexts/CartContext";
import { useEthPrice } from "../../hooks/useEthPrice";

export default function ItemDetails() {
  const params = useParams();
  const nftId = params.nftId;
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const { ethPrice, convertEthToUsd, ensureMinimumPrice } = useEthPrice();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchNFTDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!nftId) {
          throw new Error('No NFT ID provided');
        }

        console.log('Fetching NFT details for ID:', nftId);
        
        // Fetch NFT details from API
        const response = await fetch(`https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        if (data && data.nftId) {
          setNftData(data);
        } else {
          throw new Error('Invalid data received from API');
        }
      } catch (err) {
        console.error('Error fetching NFT details:', err);
        setError(err.message || 'Failed to load NFT details');
      } finally {
        setLoading(false);
      }
    };

    fetchNFTDetails();
  }, [nftId]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                {/* Skeleton for NFT Image */}
                <div className="col-md-6 text-center">
                  <div className="skeleton-box" style={{ width: '100%', height: '400px', borderRadius: '8px' }}></div>
                </div>
                
                {/* Skeleton for Content */}
                <div className="col-md-6">
                  <div className="item_info">
                    {/* Skeleton for Title */}
                    <div className="skeleton-box" style={{ width: '80%', height: '32px', marginBottom: '20px' }}></div>
                    
                    {/* Skeleton for Views/Likes */}
                    <div className="item_info_counts">
                      <div className="item_info_views">
                        <i className="fa fa-eye"></i>
                        <div className="skeleton-box" style={{ width: '30px', height: '16px', display: 'inline-block', marginLeft: '8px' }}></div>
                      </div>
                      <div className="item_info_like">
                        <i className="fa fa-heart"></i>
                        <div className="skeleton-box" style={{ width: '30px', height: '16px', display: 'inline-block', marginLeft: '8px' }}></div>
                      </div>
                    </div>
                    
                    {/* Skeleton for Description */}
                    <div className="skeleton-box" style={{ width: '100%', height: '60px', marginBottom: '20px' }}></div>
                    
                    {/* Skeleton for Owner/Creator */}
                    <div className="d-flex flex-row">
                      <div className="mr40">
                        <h6>Owner</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <div className="skeleton-box" style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
                          </div>
                          <div className="author_list_info">
                            <div className="skeleton-box" style={{ width: '100px', height: '20px' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="de_tab tab_simple">
                      <div className="de_tab_content">
                        <h6>Creator</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <div className="skeleton-box" style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
                          </div>
                          <div className="author_list_info">
                            <div className="skeleton-box" style={{ width: '100px', height: '20px' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="spacer-40"></div>
                      <h6>Price</h6>
                      <div className="nft-item-price">
                        <Image src="/images/ethereum.svg" alt="" width={20} height={20} />
                        <div className="skeleton-box" style={{ width: '60px', height: '24px', display: 'inline-block', marginLeft: '8px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <h3>Error loading NFT details</h3>
                  <p>{error}</p>
                  <Link href="/" className="btn-main">Go Back Home</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!nftData) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <h3>NFT not found</h3>
                  <p>The requested NFT could not be found.</p>
                  <Link href="/" className="btn-main">Go Back Home</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <Image
                  src={nftData.nftImage || nftData.image || '/images/nftImage.jpg'}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={nftData.title || 'NFT'}
                  width={600}
                  height={600}
                  onError={(e) => {
                    e.target.src = '/images/nftImage.jpg'; // Fallback to default image
                  }}
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{nftData.title || ''}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {nftData.views || '0'}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {nftData.likes || '0'}
                    </div>
                  </div>
                  <p>{nftData.description || 'No description available'}</p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link href={`/author/${nftData.ownerId || nftData.owner?.id || 'unknown'}`}>
                            <Image 
                              className="lazy" 
                              src={nftData.ownerImage || nftData.owner?.image || '/images/author_thumbnail.jpg'} 
                              alt={nftData.ownerName || nftData.owner?.name || 'Owner'}
                              width={50}
                              height={50}
                              onError={(e) => {
                                e.target.src = '/images/author_thumbnail.jpg'; // Fallback to default author image
                              }}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link href={`/author/${nftData.ownerId || nftData.owner?.id || 'unknown'}`}>
                            {nftData.ownerName || nftData.owner?.name || ''}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link href={`/author/${nftData.authorId || nftData.author?.id || 'unknown'}`}>
                            <Image 
                              className="lazy" 
                              src={nftData.authorImage || nftData.author?.image || '/images/author_thumbnail.jpg'} 
                              alt={nftData.authorName || nftData.author?.name || 'Creator'}
                              width={50}
                              height={50}
                              onError={(e) => {
                                e.target.src = '/images/author_thumbnail.jpg'; // Fallback to default author image
                              }}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link href={`/author/${nftData.authorId || nftData.author?.id || 'unknown'}`}>
                            {nftData.authorName || nftData.author?.name || ''}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <Image src="/images/ethereum.svg" alt="" width={20} height={20} />
                      <span>{nftData.price || '0'}</span>
                      {ethPrice && (() => {
                        const priceETH = parseFloat(nftData.price) || 0;
                        const priceUSD = ensureMinimumPrice(convertEthToUsd(priceETH));
                        return (
                          <span style={{ color: '#999', marginLeft: '8px', fontSize: '16px' }}>
                            (${priceUSD.toFixed(2)})
                          </span>
                        );
                      })()}
                    </div>
                    <div className="spacer-20"></div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '150px' }}>
                        <StripeCheckout
                          price={(() => {
                            const priceETH = parseFloat(nftData.price) || 0;
                            return ensureMinimumPrice(convertEthToUsd(priceETH));
                          })()}
                          nftId={nftData.nftId || nftData.id}
                          nftTitle={nftData.title}
                          nftImage={nftData.nftImage || nftData.image}
                        />
                      </div>
                      <div style={{ flex: '1', minWidth: '150px' }}>
                        <button
                          onClick={() => {
                            const priceETH = parseFloat(nftData.price) || 0;
                            const priceUSD = ensureMinimumPrice(convertEthToUsd(priceETH));
                            addItem({
                              nftId: nftData.nftId || nftData.id,
                              title: nftData.title || 'Untitled NFT',
                              image: nftData.nftImage || nftData.image || '/images/nftImage.jpg',
                              priceETH,
                              priceUSD,
                            });
                          }}
                          className="btn-main"
                          style={{ width: '100%', padding: '8px 20px', fontSize: '14px' }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

