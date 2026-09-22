import SearchBox from "../SearchBox/SearchBox";
import css from "./app.module.css";

export default function App() {
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox />
        <Pagination />
        <button>Create Note</button>
      </header>
    </div>
  );
}
