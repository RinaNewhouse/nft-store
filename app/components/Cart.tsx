'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { FaTimes, FaShoppingCart, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import StripeCheckout from './StripeCheckout';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalUSD, itemCount, isOpen, closeCart } = useCart();
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  // Fetch ETH price on mount
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('/api/eth-price');
        const data = await response.json();
        setEthPrice(data.ethPrice);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        setEthPrice(2500); // Fallback
      }
    };
    fetchEthPrice();
  }, []);

  if (!isOpen) return null;

  const canCheckout = totalUSD >= 0.5;

  return (
    <>
      {/* Overlay */}
      <div
        className="cart-overlay"
        onClick={closeCart}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
        }}
      />
      
      {/* Cart Sidebar */}
      <div
        className="cart-sidebar"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          maxWidth: '90vw',
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            Shopping Cart ({itemCount})
          </h3>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Cart Items */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
          }}
        >
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <FaShoppingCart style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }} />
              <p style={{ color: '#666', fontSize: '16px' }}>Your cart is empty</p>
              <Link href="/explore" className="btn-main" onClick={closeCart} style={{ marginTop: '20px', display: 'inline-block' }}>
                Browse NFTs
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((item) => (
                <div
                  key={item.nftId}
                  style={{
                    display: 'flex',
                    gap: '15px',
                    padding: '15px',
                    border: '1px solid #eee',
                    borderRadius: '8px',
                  }}
                >
                  <Link href={`/item-details/${item.nftId}`} onClick={closeCart}>
                    <Image
                      src={item.image || '/images/nftImage.jpg'}
                      alt={item.title}
                      width={80}
                      height={80}
                      style={{ borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </Link>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link href={`/item-details/${item.nftId}`} onClick={closeCart}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </h4>
                    </Link>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                      {item.priceETH} ETH
                      {ethPrice && (
                        <span style={{ color: '#999', marginLeft: '8px' }}>
                          (${(item.priceUSD).toFixed(2)})
                        </span>
                      )}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #ddd', borderRadius: '4px', padding: '4px' }}>
                        <button
                          onClick={() => updateQuantity(item.nftId, item.quantity - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            color: '#666',
                          }}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span style={{ minWidth: '30px', textAlign: 'center', fontSize: '14px' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.nftId, item.quantity + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            color: '#666',
                          }}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.nftId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#dc3545',
                          padding: '4px 8px',
                        }}
                        title="Remove item"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid #eee',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>${totalUSD.toFixed(2)}</span>
            </div>
            {!canCheckout && (
              <p style={{ color: '#dc3545', fontSize: '14px', marginBottom: '15px', textAlign: 'center' }}>
                Minimum order: $0.50
              </p>
            )}
            <StripeCheckout
              price={totalUSD}
              nftId="cart"
              nftTitle={`${itemCount} NFT${itemCount > 1 ? 's' : ''} from Cart`}
              nftImage={items[0]?.image || '/images/nftImage.jpg'}
              cartItems={items.map(item => ({
                nftId: item.nftId,
                title: item.title,
                image: item.image,
                priceETH: item.priceETH,
                priceUSD: item.priceUSD,
                quantity: item.quantity,
              }))}
              disabled={!canCheckout}
              onSuccess={() => {
                clearCart();
                closeCart();
              }}
            />
            <button
              onClick={clearCart}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '10px',
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

