'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CountdownTimer from './CountdownTimer';
import StripeCheckout from '../StripeCheckout';
import { SignInButton, useUser } from '@clerk/nextjs';
import { useCart } from '../../contexts/CartContext';
import { useEthPrice } from '../../hooks/useEthPrice';

// Skeleton component for loading state
const NFTCardSkeleton = () => {
  return (
    <div className="nft__item">
      <div className="author_list_pp">
        <div className="skeleton-box" style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
        <i className="fa fa-check"></i>
      </div>
      <div className="de_countdown">
        <div className="skeleton-box" style={{ width: '80px', height: '20px' }}></div>
      </div>
      <div className="nft__item_wrap">
        <div className="nft__item_extra">
          <div className="nft__item_buttons">
            <div className="skeleton-box" style={{ width: '80px', height: '32px', borderRadius: '4px' }}></div>
            <div className="nft__item_share">
              <h4>Share</h4>
              <div className="skeleton-box" style={{ width: '20px', height: '20px', borderRadius: '50%', margin: '0 5px' }}></div>
              <div className="skeleton-box" style={{ width: '20px', height: '20px', borderRadius: '50%', margin: '0 5px' }}></div>
              <div className="skeleton-box" style={{ width: '20px', height: '20px', borderRadius: '50%', margin: '0 5px' }}></div>
            </div>
          </div>
        </div>
        <div className="skeleton-box" style={{ width: '100%', height: '300px', borderRadius: '8px' }}></div>
      </div>
      <div className="nft__item_info">
        <div className="skeleton-box" style={{ width: '80%', height: '20px', marginBottom: '8px' }}></div>
        <div className="skeleton-box" style={{ width: '60px', height: '16px', marginBottom: '8px' }}></div>
        <div className="skeleton-box" style={{ width: '40px', height: '14px' }}></div>
      </div>
    </div>
  );
};

const NFTCard = ({ nftData, loading = false }) => {
  const { isSignedIn } = useUser();
  const { addItem } = useCart();
  const { ethPrice, convertEthToUsd, ensureMinimumPrice } = useEthPrice();

  if (loading) {
    return <NFTCardSkeleton />;
  }

  if (!nftData) {
    return null;
  }

  const handleImageError = (e) => {
    e.target.src = '/images/nftImage.jpg';
  };

  const handleAuthorImageError = (e) => {
    e.target.src = '/images/author_thumbnail.jpg';
  };

  const handleBuyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // The StripeCheckout component will handle the rest
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const priceETH = parseFloat(nftData.price) || 0;
    const priceUSD = ensureMinimumPrice(convertEthToUsd(priceETH));
    
    addItem({
      nftId: nftData.nftId || nftData.id,
      title: nftData.title || 'Untitled NFT',
      image: nftData.nftImage || nftData.image || '/images/nftImage.jpg',
      priceETH,
      priceUSD,
    });
  };

  const priceETH = parseFloat(nftData.price) || 0;
  const priceUSD = ethPrice ? ensureMinimumPrice(convertEthToUsd(priceETH)) : 0;

  return (
    <div className="nft__item" data-aos="fade-up" data-aos-delay="100">
      <div className="author_list_pp">
        <Link
          href={`/author/${nftData.authorId}`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={`Creator: ${nftData.authorName || ''}`}
        >
          <Image 
            className="lazy" 
            src={nftData.authorImage || '/images/author_thumbnail.jpg'} 
            alt={nftData.authorName || 'Author'} 
            width={50}
            height={50}
            onError={handleAuthorImageError}
          />
          <i className="fa fa-check"></i>
        </Link>
      </div>

      {/* Countdown Timer - only show if expiryDate exists */}
      {nftData.expiryDate && (
        <CountdownTimer expiryDate={nftData.expiryDate} />
      )}

      <div className="nft__item_wrap">
        <div className="nft__item_extra">
          <div className="nft__item_buttons">
            <div onClick={handleBuyClick} style={{ width: '100%', marginBottom: '8px' }}>
              <StripeCheckout
                price={priceUSD}
                nftId={nftData.nftId || nftData.id}
                nftTitle={nftData.title}
                nftImage={nftData.nftImage || nftData.image}
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="btn-main"
              style={{ width: '100%', marginBottom: '8px', fontSize: '14px', padding: '8px 20px' }}
            >
              Add to Cart
            </button>
            <div className="nft__item_share">
              <h4>Share</h4>
              <a href="" target="_blank" rel="noreferrer">
                <i className="fa fa-facebook fa-lg"></i>
              </a>
              <a href="" target="_blank" rel="noreferrer">
                <i className="fa fa-twitter fa-lg"></i>
              </a>
              <a href="">
                <i className="fa fa-envelope fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
                  <Link 
            href={`/item-details/${nftData.nftId || nftData.id}`}
          >
            <Image 
              src={nftData.nftImage || nftData.image || '/images/nftImage.jpg'} 
              className="lazy nft__item_preview" 
              alt={nftData.title || 'NFT'}
              width={300}
              height={300}
              onError={handleImageError}
            />
          </Link>
      </div>
      <div className="nft__item_info">
                  <Link 
            href={`/item-details/${nftData.nftId}`}
          >
            <h4>{nftData.title || ''}</h4>
          </Link>
        <div className="nft__item_price">
          {priceETH} ETH
          {ethPrice && priceUSD > 0 && (
            <span style={{ color: '#999', marginLeft: '8px', fontSize: '14px' }}>
              (${priceUSD.toFixed(2)})
            </span>
          )}
        </div>
        <div className="nft__item_like">
          <i className="fa fa-heart"></i>
          <span>{nftData.likes || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
