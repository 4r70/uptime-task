import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

import Modal from "../components/modal.js";
import Header, { getServerSideProps } from "../components/header";

export { getServerSideProps };

import styles from "../styles/Home.module.css";

export default function Home({ data, error }) {
  // console.log(data)
  if (error) {
    console.log(error)
  }

  const [combinedData, setCombinedData] = useState(data);
  const [baseData, setBaseData] = useState(data);

  const handleHeaderData = (newData) => {
    console.log(data)
    console.log(newData)
    const updatedCombinedData = [...baseData, ...newData].sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
    setCombinedData(updatedCombinedData);

    const newCategories = newData.map((item) => item.categories.map((category) => category._)).flat();
    setSelectedCategories((prevCategories) => Array.from(new Set([...prevCategories, ...newCategories])));
  }

  const [filterOpen, setFilterOpen] = useState(false);

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
    const nonEmptyCategories = item.categories ? item.categories.filter(category => category !== "") : [];
    nonEmptyCategories.forEach(category => categories.add(category._));
  });

  categories = Array.from(categories).sort((a, b) => a.localeCompare(b));

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

  const firstRowCategories = categoriesRow.slice(0, Math.floor(categoriesRow.length / 2));
  const secondRowCategories = categoriesRow.slice(Math.floor(categoriesRow.length / 2));

  // console.log(selectedCategories.length, categories.length)

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
            <a className={styles.article} key={index} href={"#"}>
              <span className={styles.articleColor} style={{ backgroundColor: item.color, width: ".75rem", height: ".75rem", borderRadius: "50%" }}></span>
              <div className={styles.articleTagWrapper}>
                {/* {item.categories[0] !== "" && item.categories.map((category, index) => (
                    selectedCategories.includes(category._) && // if a category isnt selected then it will not be shown on the article either. less clutter and confusion. OPTIONAL, not in use currently
                    <span key={index} className={styles.categoryTag} data-category={category._}>{category._}</span>
                  ))} */}
                {item.categories[0] !== "" && item.categories.map((category, index) => (
                  <span key={index} className={styles.categoryTag} data-category={category._}>{category._}</span>
                ))}
              </div>
              {item.link.endsWith(".jpg") || item.link.endsWith(".png") || item.link.endsWith(".jpeg") ? (
                <div className={styles.articleImageWrapper}>
                  <Image
                    className={styles.articleImage}
                    src={item.link}
                    alt={item.title}
                    width={200}
                    height={150}
                  />
                </div>
              ) : null}
              <h3 className={styles.articleTitle}>{index == 0 ? item.title : item.title.length > 100 ? item.title.substring(0, 100) + "..." : item.title}</h3>
              <p className={styles.articleSnippet}>{item.contentSnippet}</p>
              <div className={styles.articleBottomRow}>
                <h5 className={styles.articleAuthor}>{item.author}</h5>
                <p className={styles.articleDate}>{new Date(item.isoDate).toLocaleDateString("en-GB")}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </>
  );
}
