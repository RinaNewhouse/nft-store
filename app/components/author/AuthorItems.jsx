'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const AuthorItemsSkeleton = () => {
  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {new Array(8).fill(0).map((_, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <div className="skeleton-box" style={{ width: '50px', height: '50px', borderRadius: '50%' }}></div>
                  <i className="fa fa-check"></i>
                </div>
                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
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
                  <div className="skeleton-box" style={{ width: '100%', height: '200px', borderRadius: '8px' }}></div>
                </div>
                <div className="nft__item_info">
                  <div className="skeleton-box" style={{ width: '80%', height: '20px', marginBottom: '8px' }}></div>
                  <div className="skeleton-box" style={{ width: '60px', height: '16px', marginBottom: '8px' }}></div>
                  <div className="skeleton-box" style={{ width: '40px', height: '14px' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AuthorItems = ({ authorId, authorImage, authorData }) => {
  const [authorItems, setAuthorItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorItems = async () => {
      try {
        setLoading(true);
        
        // If no authorId is provided, show skeleton
        if (!authorId) {
          setLoading(true);
          return;
        }
        
        // If we have authorData with nftCollection, use that
        if (authorData && authorData.nftCollection && authorData.nftCollection.length > 0) {
          setAuthorItems(authorData.nftCollection);
        } else {
          // No data available - show empty state
          setAuthorItems([]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching author items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorItems();
  }, [authorId, authorImage, authorData]);

  const handleImageError = (e) => {
    e.target.src = '/images/nftImage.jpg';
  };

  // Show skeleton if loading or no authorId provided
  if (loading || !authorId) {
    return <AuthorItemsSkeleton />;
  }

  if (error) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="text-center">
            <p>Error loading author items: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {authorItems.map((item) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.id}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link href={`/author/${authorId}`}>
                    <Image className="lazy" src={authorImage || '/images/author_thumbnail.jpg'} alt="" width={50} height={50} />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
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
                    href={`/item-details/${item.nftId}`}
                  >
                    <Image
                      src={item.nftImage || item.image || '/images/nftImage.jpg'}
                      className="lazy nft__item_preview"
                      alt={item.title}
                      width={300}
                      height={300}
                      onError={handleImageError}
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link 
                    href={`/item-details/${item.nftId}`}
                  >
                    <h4>{item.title}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
