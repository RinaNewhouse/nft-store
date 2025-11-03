'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const TopSellersSkeleton = () => {
  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {new Array(12).fill(0).map((_, index) => (
                <li key={index}>
                  <div className="author_list_pp">
                    <div className="skeleton-box" style={{ width: '60px', height: '60px', borderRadius: '50%' }}></div>
                    <i className="fa fa-check"></i>
                  </div>
                  <div className="author_list_info">
                    <div className="skeleton-box" style={{ width: '120px', height: '16px', marginBottom: '8px' }}></div>
                    <div className="skeleton-box" style={{ width: '80px', height: '14px' }}></div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

const TopSellers = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const response = await fetch('https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers');
        if (!response.ok) {
          throw new Error('Failed to fetch top sellers');
        }
        const data = await response.json();
        setTopSellers(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching top sellers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();
  }, []);

  const handleImageError = (e) => {
    e.target.src = '/images/author_thumbnail.jpg';
  };

  if (loading) {
    return <TopSellersSkeleton />;
  }

  if (error) {
    return (
      <section id="section-popular" className="pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="text-center">
                <h2>Top Sellers</h2>
                <div className="small-border bg-color-2"></div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="text-center">
                <p>Error loading top sellers: {error}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {topSellers.map((seller, index) => (
                <li key={seller.id} data-aos="fade">
                  <div className="author_list_pp">
                    <Link href={`/author/${seller.authorId}`}>
                      <Image
                        className="lazy pp-author"
                        src={seller.authorImage || '/images/author_thumbnail.jpg'}
                        alt={seller.authorName}
                        width={60}
                        height={60}
                        onError={handleImageError}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="author_list_info">
                    <Link href={`/author/${seller.authorId}`}>{seller.authorName}</Link>
                    <span>{seller.price} ETH</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
