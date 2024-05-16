import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

import Modal from "../components/modal.js";
import Header, { getServerSideProps } from "../components/header";

export { getServerSideProps };

import styles from "../styles/Home.module.css";

export default function Home({ data, error, test }) {
  // console.log(data)
  if (error) {
    console.log(error)
  }

  // console.log(test)

  const [combinedData, setCombinedData] = useState(data);
  const [baseData, setBaseData] = useState(data);
  const [articleOpen, setArticleOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [newArticleData, setNewArticleData] = useState({});

  const handleHeaderData = (newData) => {
    // console.log(data)
    // console.log(newData)
    const updatedCombinedData = [...baseData, ...newData].sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
    setCombinedData(updatedCombinedData);

    const newCategories = newData.map((item) => item.categories.map((category) => category._)).flat(); // Remove empty categories
    setSelectedCategories((prevCategories) => Array.from(new Set([...prevCategories, ...newCategories]))); // Add new categories to selected categories, remove duplicates
  }

  const handleFilterChange = (event) => {
    const category = event.target.value;
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(selectedCategory => selectedCategory !== category));
    }
  }

  let categories = new Set();

  combinedData.forEach(item => {
    const nonEmptyCategories = item.categories ? item.categories.filter(category => category !== "") : []; // Dont add empty categories
    nonEmptyCategories.forEach(category => categories.add(category._));
  });

  categories = Array.from(categories).sort((a, b) => a.localeCompare(b)); // Sort by time

  const [selectedCategories, setSelectedCategories] = useState(categories);
  const [categoriesRow, setCategoriesRow] = useState(categories);

  useEffect(() => {
    setCategoriesRow(categories);
  }, [combinedData]);

  const handleSelectAll = () => {
    if (selectedCategories.length < categories.length) {
      setSelectedCategories(categories);
    } else {
      setSelectedCategories([]);
    }
  }

  // Split categories into two rows for the filter modal
  const firstRowCategories = categoriesRow.slice(0, Math.floor(categoriesRow.length / 2));
  const secondRowCategories = categoriesRow.slice(Math.floor(categoriesRow.length / 2));

  // console.log(selectedCategories.length, categories.length)

  const handleArticleClick = async (article) => {
    // console.log(article)
    setSelectedArticle(article);
    setArticleOpen(true);
    try {
      // Webparser API
      const response = await fetch(`/api/parse?url=${encodeURIComponent(article.link)}`)
      const articleData = await response.json();
      setNewArticleData({ ...article, ...articleData });
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
    }
  }

  return (
    <>
      <Head>
        <title>Lolo v5</title>
        <meta name="description" content="Uptime exercise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.bg}></div>
      <Header onHeaderData={handleHeaderData} />
      <main className={styles.main}>
        <div className={styles.headingRow}>
          <h2 className={styles.title}>Your feed</h2>
          <button onClick={() => setFilterOpen(true)} className={styles.filterButton}>
            <Image className={styles.filterIcon} src={"/filter.svg"} width={26} height={26} />
            Filter
          </button>
        </div>
        <Modal isOpen={filterOpen} onClose={() => setFilterOpen(false)}>
          <h3 className={styles.filterModalHeading}>Filter</h3>
          <div className={styles.filterColumnsRow}>
            <div className={styles.filterColumn}>
              <div className={styles.filterRow}>
                <input className={styles.filterCheckbox}
                  type="checkbox"
                  checked={selectedCategories.length === categories.length}
                  onChange={handleSelectAll}
                />
                <span className={styles.filterTag}>Select all</span>
              </div>
              {firstRowCategories.map((category, index) => (
                <div className={styles.filterRow} key={index}>
                  <input className={styles.filterCheckbox}
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={handleFilterChange}
                  />
                  <span className={styles.filterTag}>{category}</span>
                </div>
              ))}
            </div>
            <div className={styles.filterColumn}>
              {secondRowCategories.map((category, index) => (
                <div className={styles.filterRow} key={index}>
                  <input className={styles.filterCheckbox}
                    type="checkbox"
                    value={category}
                    checked={selectedCategories.includes(category)}
                    onChange={handleFilterChange}
                  />
                  <span className={styles.filterTag}>{category}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
        <div className={styles.articlesWrapper}>
          {combinedData.map((item, index) => (
            (selectedCategories.some((selectedCategory) =>
              item.categories.map((category) => category._)
                .includes(selectedCategory)) || item.categories[0] === "") &&
            <button className={styles.article} key={index} onClick={() => { handleArticleClick(item) }}>
              {item["media:content"] && (
                <Image
                  className={styles.articleImage}
                  src={item["media:content"]["$"].url}
                  width={item["media:content"]["$"].width}
                  height={item["media:content"]["$"].height}
                />
              )}
              <div className={styles.articleTagOuterWrapper}>
                <div className={styles.articleTagWrapper}>
                  {/* {item.categories[0] !== "" && item.categories.map((category, index) => (
                    selectedCategories.includes(category._) && // if a category isnt selected then it will not be shown on the article either. less clutter and confusion. OPTIONAL, not in use currently
                    <span key={index} className={styles.categoryTag} data-category={category._}>{category._}</span>
                  ))} */}
                  {item.categories[0] !== "" && item.categories.map((category, index) => (
                    <span key={index} className={styles.categoryTag} data-category={category._}>{category._}</span>
                  ))}
                </div>
              </div>
              <div className={styles.articleContentWrapper}>
                <h3 className={styles.articleTitle}>
                  {index == 0 ? item.title : item.title.length > 100 ?
                    item.title.substring(0, 100) + "..." : item.title}
                </h3>
                <p className={styles.articleSnippet}>{item.contentSnippet}</p>
                <div className={styles.articleBottomRow}>
                  <div className={styles.articleColorAuthorWrapper}>
                    {item.color && <span className={styles.articleColor} style={{ backgroundColor: item.color }}></span>}
                    <h5 className={styles.articleAuthor}>{item.author ? item.author : item.creator}</h5>
                  </div>
                  <p className={styles.articleDate}>{new Date(item.isoDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <Modal noPadding isOpen={articleOpen} onClose={() => { setArticleOpen(false); setSelectedArticle({}); setNewArticleData({}) }}>
          {newArticleData && Object.keys(newArticleData).length > 0 ? ( // Use new data (old data + new data combined) when it has been fetched
            <div className={styles.modalArticle}>
              {console.log(newArticleData)}
              {newArticleData["media:content"] && (
                <Image
                  className={styles.modalArticleImage}
                  src={newArticleData["media:content"]["$"].url}
                  width={newArticleData["media:content"]["$"].width}
                  height={newArticleData["media:content"]["$"].height}
                />
              )}
              <div className={styles.modalArticleContentWrapper}>
                <h3 className={styles.modalArticleTitle}>{newArticleData.articleData.title ? newArticleData.articleData.title : newArticleData.title}</h3>
                <div className={styles.modalArticleAuthorDateWrapper}>
                  <span className={styles.modalArticleAuthor}>
                    {newArticleData.articleData.author ?
                      newArticleData.articleData.author : newArticleData.articleData.creator ?
                        newArticleData.articleData.creator : newArticleData.author ?
                          newArticleData.author : newArticleData.creator
                    }
                  </span>
                  <span className={styles.modalArticleDate}>
                    {newArticleData.articleData.date_published ?
                      new Date(newArticleData.articleData.date_published).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) :
                      new Date(newArticleData.isoDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                </div>
                {newArticleData.articleData.content ? (
                  <div className={styles.modalArticleContent} dangerouslySetInnerHTML={{ __html: newArticleData.articleData.content }} />
                ) : (
                  <p>No content available.</p>
                )}
              </div>
            </div>
          ) : selectedArticle ? ( // Use existing data at first, user gets some content instantly
            <div className={styles.modalArticle}>
              {selectedArticle["media:content"] && (
                <Image
                  className={styles.modalArticleImage}
                  src={selectedArticle["media:content"]["$"].url}
                  width={selectedArticle["media:content"]["$"].width}
                  height={selectedArticle["media:content"]["$"].height}
                />
              )}
              <div className={styles.modalArticleContentWrapper}>
                <h3 className={styles.modalArticleTitle}>{selectedArticle.title}</h3>
                <span className={styles.modalArticleAuthor}>{selectedArticle.author ? selectedArticle.author : selectedArticle.creator}</span>
                <div className={styles.modalArticleContent}>{selectedArticle.contentSnippet}</div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal>
      </main>
    </>
  );
}
