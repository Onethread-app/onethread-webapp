import SearchBar from 'material-ui-search-bar';
import { useState } from 'react';

import './SearchOption.scss';

const SearchOption = ({ list, rows, setRows }: any) => {
  const [searched, setSearched] = useState<string>('');
  const requestSearch = (searchedVal: string) => {
    if (searchedVal === '') {
      setRows(list);
    } else {
      if (rows) {
        const filteredRows = rows.filter((row) => {
          return row.name
            .toLowerCase()
            .includes(searchedVal.toLowerCase());
        });
        setRows(filteredRows);
      }
    }
  };

  const cancelSearch = () => {
    setSearched('');
    setRows(list);
  };

  return (
    <SearchBar
      className="search-bar"
      value={searched}
      onChange={(searchVal) => requestSearch(searchVal)}
      onCancelSearch={() => cancelSearch()}
      placeholder="search with name"
    />
  );
};

export default SearchOption;
