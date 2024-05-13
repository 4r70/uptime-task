import HeaderStyles from "../styles/Header.module.css";

import Modal from "../components/modal.js";

import { useEffect, useState } from "react";

import Parser from 'rss-parser';

export async function getServerSideProps() {
    const urls = ["https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss"];
    const parser = new Parser();
    try {
        const data = [];
        for (const url of urls) {
            const feed = await parser.parseURL(url);
            data.push(...feed.items)
        }
        console.log("URLs:", urls);
        return {
            props: {
                data,
                urls,
            },
        };
    } catch (error) {
        return {
            props: {
                data: {},
                error: "Error fetching data: " + error,
                urls: [],
            },
        };
    }
}

export default function Header({ onHeaderData }) {
    const [feedsOpen, setFeedsOpen] = useState(false);
    const [feedUrls, setFeedUrls] = useState([]);
    const [inputUrl, setInputUrl] = useState("");
    const [newData, setNewData] = useState()

    useEffect(() => {
        const parser = new Parser();
        const fetchData = async () => {
            const newDataArray = [];
            for (const url of feedUrls) {
                const feed = await parser.parseURL("https://cors-anywhere.herokuapp.com/" + url);
                console.log(feed)
                newDataArray.push(...feed.items)
            }
            setNewData(newDataArray);
            onHeaderData(newDataArray);
        }
        fetchData();
    }, [feedUrls]);

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
                    <button className={HeaderStyles.addFeedButton} onClick={() => { setFeedUrls([...feedUrls, inputUrl]); setInputUrl(""); }}>Add</button>
                </div>
            </Modal>
        </>
    );
}