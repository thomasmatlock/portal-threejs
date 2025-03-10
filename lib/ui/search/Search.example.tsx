// Search.example.tsx
import React, { useState } from 'react';
import Search from './Search';
import styles from './Search.example.module.scss';

interface ExampleProps {
	theme: 'light' | 'dark';
}

const SearchExample: React.FC<ExampleProps> = ({ theme }) => {
	const [searchResults, setSearchResults] = useState<string>('');

	const handleSearch = (value: string) => {
		setSearchResults(value);
	};

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				<h6>Basic Search</h6>
				<div className={styles.example}>
					<Search
						id="basic-search"
						theme={theme}
						placeholder="Search..."
						onSearch={handleSearch}
					/>
					{/* {searchResults && (
						<p className={styles.results}>Searching for: {searchResults}</p>
						<p className={styles.results}>Searching for: {searchResults}</p>
					)} */}
				</div>
			</section>

			{/* <section className={styles.section}>
				<h6>With Auto Focus</h6>
				<div className={styles.example}>
					<Search
						id="autofocus-search"
						theme={theme}
						placeholder="Focuses automatically"
						autoFocus
					/>
				</div>
			</section> */}

			{/* <section className={styles.section}>
				<h6>Custom Width</h6>
				<div className={styles.example}>
					<Search
						id="custom-width-search"
						theme={theme}
						placeholder="Custom width search..."
						className={styles.customWidth}
					/>
				</div>
			</section> */}
		</div>
	);
};

export default SearchExample;
