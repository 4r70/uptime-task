import HeaderStyles from "../styles/Header.module.css";

export default function Header() {
    return (
        <header className={HeaderStyles.header}>
            <h1>Lolo v5</h1> <button className={HeaderStyles.feedsButton}>Your feeds</button>
        </header>
    );
}