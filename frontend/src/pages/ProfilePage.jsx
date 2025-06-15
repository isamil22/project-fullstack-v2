import React from 'react';
import UserOrdersPage from './UserOrdersPage'; // We'll reuse the existing orders component
import ReviewForm from '../components/ReviewForm'; // And the existing review form

const ProfilePage = () => {
    // This handler can be used to refresh data if needed after a review is submitted
    const handleReviewSubmitted = () => {
        console.log("Review submitted. Data can be re-fetched here if necessary.");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content: Order History */}
                <div className="lg:col-span-2">
                    {/* We are reusing the component logic from UserOrdersPage */}
                    <UserOrdersPage />
                </div>

                {/* Sidebar: Review Form */}
                <div className="lg:col-span-1">
                    <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;