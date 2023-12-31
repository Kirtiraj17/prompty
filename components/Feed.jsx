"use client";
import { useState, useEffect, useCallback } from "react";
import PromptCardList from "./PromptCardList";

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [originalPosts, setOriginalPosts] = useState([]);
  const [posts, setPosts] = useState([]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const cacheBuster = new Date().getTime();
      const response = await fetch(`/api/prompt?cacheBuster=${cacheBuster}`);
      const data = await response.json();

      setOriginalPosts(data);
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const debouncedSearch = useCallback(() => {
    let filteredPosts = originalPosts?.filter((p) => {
      return (
        p?.prompt?.toLowerCase().includes(searchText.toLowerCase()) ||
        p?.tag?.toLowerCase().includes(searchText.toLowerCase()) ||
        p?.creator?.username.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    setPosts(filteredPosts);
  }, [searchText, originalPosts]);

  useEffect(() => {
    const timerID = setTimeout(() => debouncedSearch(), 500);
    if (searchText === "") setPosts(originalPosts);

    return () => clearTimeout(timerID);
  }, [searchText, originalPosts, debouncedSearch]);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a prompt, tag or username"
          value={searchText}
          onChange={(e) => handleSearchChange(e)}
          required
          className="search_input peer"
        />
      </form>

      {posts.length > 0 ? (
        <PromptCardList data={posts} handleTagClick={() => {}} />
      ) : (
        <div className="my-8">
          <p className="desc">No Posts Found!</p>
        </div>
      )}
    </section>
  );
};

export default Feed;
