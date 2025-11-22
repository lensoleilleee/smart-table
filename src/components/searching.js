export function initSearching(searchField) {
  return (query, state, action) => {
    // result заменили на query
    return state[searchField]
      ? Object.assign({}, query, {
          // проверяем, что в поле поиска было что-то введено
          search: state[searchField], // устанавливаем в query параметр
        })
      : query; // если поле с поиском пустое, просто возвращаем query без изменений
  };

  // return (data, state, action) => {
  //     const query = state?.[searchField];
  //     if (!query) return data;
  //     // @todo: #5.2 — применить компаратор

  //     return data.filter(item => {
  //         return rules.searchMultipleFields( searchField, ['date', 'customer', 'seller'], false)(compare, item, query);
  //     });
  // }
}
