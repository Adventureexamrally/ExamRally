import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories, selectForumLoading } from '../../slice/forumSlice';
import GlobalLoader from '../GlobalLoader';

/**
 * ForumRedirect — Instantly send users to the first forum category's thread list.
 * This bypasses the ForumMain category-picker page entirely.
 */
const ForumRedirect = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectForumLoading);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (!loading && categories.length > 0) {
            const first = categories[0];
            navigate(`/forum/category/${first._id}`, { replace: true });
        }
    }, [categories, loading, navigate]);

    return <GlobalLoader message="Loading Forum…" sub="Fetching discussions for you" />;
};

export default ForumRedirect;
