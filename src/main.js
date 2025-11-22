import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering";
import { initSearching } from "./components/searching";

const api = initData(sourceData);

let indexes = {};

// Исходные данные используемые в render()
// const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    // расширьте существующий return вот так
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */

// делаем render() асинхронной
async function render(action) {
  let state = collectState();
  let query = {};
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action); //обновляем query
  const { total, items } = await api.getRecords(query); // получение данных
  updatePagination(total, query); // перерисовываем пагинатор
  sampleTable.render(items);
}

// function render(action) {
//     let state = collectState(); // состояние полей из таблицы
//     let result = [...data]; // копируем для последующего изменения
//     // @todo: использование
//     // result = applySearching(result, state, action);
//     // result = applyFiltering(result, state, action);
//     // result = applySorting(result, state, action);
//     // result = applyPagination(result, state, action);
//     sampleTable.render(result);
// }

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация

const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);
const applySearching = initSearching(
  sampleTable.search.elements.searchInput,
  "searchField"
);

const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);
//const { applyFiltering, updateIndexes }  = initFiltering(sampleTable.filter.elements, {
// searchBySeller: indexes.sellers })

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  indexes = await api.getIndexes(); //получаем индексы

  updateIndexes(sampleTable.filter.elements, {
    //обновление индексов
    searchBySeller: indexes.sellers,
  });
}

init().then(() => render());
