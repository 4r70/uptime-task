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

    const [inputUrl, setInputUrl] = useState("");
    const [inputColor, setInputColor] = useState("#000000");

    useEffect(() => {
        async function fetchData() {
            if (typeof window !== "undefined" && feedUrls != "") {
                localStorage.setItem("feedUrls", JSON.stringify(feedUrls));
            }
            const newDataArray = [];
            for (const { url, color } of feedUrls) {
                const response = await fetch(`/api/rss?url=${encodeURIComponent(url)}`);
                const feed = await response.json();
                console.log(feed)
                const fixedFeed = feed.items.map((item) => ({
                    ...item,
                    categories: item.categories || [""],
                    color: color || "",
                }));
                console.log(fixedFeed)
                if (feed.error) {
                    console.error('Error fetching RSS feed:', feed.error);
                    break;
                }
                newDataArray.push(...fixedFeed)
            }
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
                {feedUrls != "" ? feedUrls.map(({ url, color }, index) => (
                    <div className={HeaderStyles.feedRow}>
                        <input
                            type="color"
                            className={HeaderStyles.feedColorPicker}
                            value={color}
                            onChange={(e) => {
                                const newColor = e.target.value;
                                const updatedFeedUrls = [...feedUrls];
                                updatedFeedUrls[index].color = newColor;
                                setFeedUrls(updatedFeedUrls);
                                localStorage.setItem("feedUrls", JSON.stringify(updatedFeedUrls));
                            }}
                        /> {/* style this later */}
                        <span className={HeaderStyles.feedName}>{url}</span>
                        <div className={HeaderStyles.feedEditButtons}>
                            <button className={HeaderStyles.feedEditButton}
                                onClick={() => {
                                    setInputUrl(url);
                                    const updatedFeedUrls = [...feedUrls];
                                    updatedFeedUrls.splice(index, 1);
                                    setFeedUrls(updatedFeedUrls);
                                    localStorage.setItem("feedUrls", JSON.stringify(updatedFeedUrls));
                                }}
                            >Edit</button> {/* implement better editing later */}
                            <button className={HeaderStyles.feedRemoveButton}
                                onClick={() => {
                                    const updatedFeedUrls = [...feedUrls];
                                    updatedFeedUrls.splice(index, 1);
                                    setFeedUrls(updatedFeedUrls);
                                    localStorage.setItem("feedUrls", JSON.stringify(updatedFeedUrls));
                                }}
                            >Remove</button>
                        </div>
                    </div>
                )) : <span>No custom feeds added</span>}
                <h4 className={HeaderStyles.feedsModalSubHeading}>Add a feed:</h4>
                <div className={HeaderStyles.feedsInputRow}>
                    <input className={HeaderStyles.feedsInput}
                        type="text"
                        placeholder="Feed URL"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)} />
                    <button className={HeaderStyles.addFeedButton}
                        onClick={(e) => {
                            try {
                                new URL(inputUrl);
                                setFeedUrls((prevFeedUrls) => [
                                    ...prevFeedUrls,
                                    { url: inputUrl, color: "" }, 
                                ]);
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