import HeaderStyles from "../styles/Header.module.css";

import Modal from "../components/modal.js";

import { useEffect, useState } from "react";

import Parser from 'rss-parser';

export async function getServerSideProps() {
    const url = "https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss";
    const parser = new Parser();
    try {
        const data = [];
            const feed = await parser.parseURL(url);
            data.push(...feed.items)
        return {
            props: {
                data,
                url,
            },
        };
    } catch (error) {
        return {
            props: {
                data: {},
                error: "Error fetching data: " + error,
                url: "",
            },
        };
    }
}

export default function Header({ onHeaderData }) {
    const [feedsOpen, setFeedsOpen] = useState(false);
    const [feedUrls, setFeedUrls] = useState([]);
    useEffect(() => {
        setFeedUrls(JSON.parse(localStorage.getItem("feedUrls")) || []);
    }, []);
    if (typeof window !== "undefined") {
        console.log(JSON.parse(localStorage.getItem("feedUrls")))
    }

    const [inputUrl, setInputUrl] = useState("");
    const [newData, setNewData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (typeof window !== "undefined" && feedUrls != "") {
                localStorage.setItem("feedUrls", JSON.stringify(feedUrls));
            }
            const newDataArray = [];
            for (const url of feedUrls) {
                const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`);
                const feed = await response.json();
                const fixedFeed = feed.items.map((item) => ({
                    ...item,
                    categories: item.categories || [""],
                }));
                console.log(fixedFeed)
                if (feed.error) {
                    console.error('Error fetching RSS feed:', feed.error);
                    break;
                }
                newDataArray.push(...fixedFeed)
            }
            setNewData(newDataArray);
            onHeaderData(newDataArray);
        }
        fetchData();
    }, [feedUrls])

    return (
        <>
            <header className={HeaderStyles.header}>
                <h1>Lolo v5</h1> <button onClick={() => setFeedsOpen(true)} className={HeaderStyles.feedsButton}>Your feeds</button>
            </header>
            <Modal isOpen={feedsOpen} onClose={() => setFeedsOpen(false)}>
                <h3 className={HeaderStyles.feedsModalHeading}>Your feeds</h3>
                {feedUrls != "" ? feedUrls.map((url, index) => (
                    <span className={HeaderStyles.feedName}>{url}</span>
                )) : <span>No custom feeds added</span>}
                <h4 className={HeaderStyles.feedsModalSubHeading}>Add a feed:</h4>
                <div className={HeaderStyles.feedsInputRow}>
                    <input className={HeaderStyles.feedsInput} type="text" placeholder="Feed URL" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} />
                    <button className={HeaderStyles.addFeedButton} onClick={(e) => {
                        try {
                            new URL(inputUrl);
                            setFeedUrls([...feedUrls, inputUrl]);
                            setInputUrl("");
                        } catch (error) {
                            console.error('Invalid URL:', error);
                            e.stopPropagation();
                        }
                    }}>Add</button>
                </div>
            </Modal>
        </>
    );
}