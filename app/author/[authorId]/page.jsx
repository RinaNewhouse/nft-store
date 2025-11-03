'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthorItems from "../../components/author/AuthorItems";

const AuthorProfileSkeleton = () => {
  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{ background: `url("/images/author_banner.jpg") top` }}
        ></section>
        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <div className="skeleton-box" style={{ width: '150px', height: '150px', borderRadius: '50%' }}></div>
                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          <div className="skeleton-box" style={{ width: '200px', height: '24px', marginBottom: '8px' }}></div>
                          <div className="skeleton-box" style={{ width: '150px', height: '16px', marginBottom: '8px' }}></div>
                          <div className="skeleton-box" style={{ width: '300px', height: '14px' }}></div>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="skeleton-box" style={{ width: '100px', height: '16px', marginBottom: '8px' }}></div>
                      <div className="skeleton-box" style={{ width: '80px', height: '40px', borderRadius: '20px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems authorId={null} authorImage="/images/author_thumbnail.jpg" authorData={null} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default function Author() {
  const params = useParams();
  const authorId = params.authorId;
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        
        if (!authorId) {
          setError('No author ID provided');
          return;
        }

        // Fetch individual author data using the specific API endpoint
        const response = await fetch(`https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch author data');
        }
        const data = await response.json();
        
        if (data && data.authorId) {
          // API returns a single object, not an array
          setAuthor(data);
          setFollowerCount(data.followers || 0);
        } else {
          setError('Author not found');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching author data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId]);

  const handleImageError = (e) => {
    e.target.src = '/images/author_thumbnail.jpg';
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      setFollowerCount(prev => prev - 1);
      setIsFollowing(false);
    } else {
      setFollowerCount(prev => prev + 1);
      setIsFollowing(true);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (loading) {
    return <AuthorProfileSkeleton />;
  }

  if (error || !author) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="text-center">
                    <p>Error loading author information: {error || 'Author not found'}</p>
                    <Link href="/" className="btn-main">Go Back Home</Link>
                  </div>
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

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{ background: `url("/images/author_banner.jpg") top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex" data-aos="fade-up">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <Image 
                        src={author.authorImage || '/images/author_thumbnail.jpg'} 
                        alt={author.authorName}
                        width={150}
                        height={150}
                        onError={handleImageError}
                      />

                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {author.authorName}
                          <span className="profile_username">@{author.authorName.toLowerCase().replace(/\s+/g, '')}</span>
                          <span id="wallet" className="profile_wallet">
                            {author.address}
                          </span>
                          <button 
                            id="btn_copy" 
                            title="Copy Address"
                            onClick={() => copyToClipboard(author.address)}
                            className={copySuccess ? 'copied' : ''}
                          >
                            {copySuccess ? 'Copied!' : 'Copy'}
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">{followerCount} followers</div>
                      <button 
                        className={`btn-main ${isFollowing ? 'btn-following' : ''}`}
                        onClick={handleFollowToggle}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple" data-aos="fade-up" data-aos-delay="200">
                  <AuthorItems 
                    authorId={authorId} 
                    authorImage={author.authorImage || '/images/author_thumbnail.jpg'}
                    authorData={author}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

