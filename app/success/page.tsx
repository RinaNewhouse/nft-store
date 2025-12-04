'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // You can verify the session here if needed
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: '100px 20px' }}>
        <h2>Processing...</h2>
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
              <div className="col-md-12 text-center">
                <div style={{ padding: '60px 20px' }}>
                  <div style={{ fontSize: '80px', color: '#28a745', marginBottom: '20px' }}>
                    ✓
                  </div>
                  <h1>Payment Successful!</h1>
                  <p className="lead" style={{ marginTop: '20px', marginBottom: '30px' }}>
                    Thank you for your purchase. Your NFT has been added to your collection.
                  </p>
                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/explore" className="btn-main">
                      Browse More NFTs
                    </Link>
                    <Link href="/" className="btn-main">
                      Go Home
                    </Link>
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

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="container text-center" style={{ padding: '100px 20px' }}>
        <h2>Loading...</h2>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

