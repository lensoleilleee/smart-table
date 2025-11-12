import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison({ skipEmptyTargetValues: true })

    return (data, state, action) => {
        const query = state?.[searchField];
        if (!query) return data;
        // @todo: #5.2 — применить компаратор

        return data.filter(item => {
            return rules.searchMultipleFields( searchField, ['date', 'customer', 'seller'], false)(compare, item, query);
        });
    }
}