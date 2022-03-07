"use strict";
import StoreHouse from './storeHouseModel.js';

class StoreHouseView {

  #excecuteHandler(
    handler, handlerArguments, scrollElement, data, url, event) {
    handler(...handlerArguments);
    $(scrollElement).get(0).scrollIntoView();
    history.pushState(data, null, url);
    event.preventDefault();
  }

  constructor() {
    this.main = $('main');
    this.categories = $('#categories');
    this.stores = $('#stores');
  }

  //Mostrar las tiendas tanto en el menu como en el main
  showStores(_stores) {
    this.main.empty();
    if (this.stores.children().length > 1)
      this.stores.children().remove();
    let container = `<section class="stores" id="container_stores">`;
    for (let store of _stores) {
      this.stores.append(`<a data-store="${store.store.name}" class='dropdown-item' href='#product-list-store'>${store.store.name}</a>`);
      container += `<a href="#product-list-store" data-store="${store.store.name}"><article class="store"><img class="img_stores" src="img/${store.store.name}.png"></article></a>`;
    }
    container += "</section>";
    container = $(container);
    this.main.append(container);
  }

  showCategories(_categories) {
    if (this.categories.children().length > 1)
      this.categories.children().remove();
    for (let category of _categories) {
      this.categories.append(`<a data-category="${category.title}" class='dropdown-item' href='#product-list-category'>${category.title}</a>`);
    }
  }

  bindInit(handler) {
    $('#init').click((event) => {
      this.#excecuteHandler(handler, [], 'body', { action: 'init' }, '#', event);
    });
    $('#logo').click((event) => {
      this.#excecuteHandler(handler, [], 'body', { action: 'init' }, '#', event);
    });
  }

  bindProductsCategoryList(handler) {
    this.categories.children().click((event) => {
      let category =
        $(event.target).closest($('a')).get(0).dataset.category;
      this.#excecuteHandler(
        handler, [category],
        '#product-list',
        { action: 'productsCategoryList', category: category },
        '#category-list', event);
    });
  }

  bindProductsStoreList(handler) {
    this.stores.children().click((event) => {
      let store =
        $(event.target).closest($('a')).get(0).dataset.store;
      this.#excecuteHandler(
        handler, [store],
        '#product-list',
        { action: 'productsStoreList', store: store },
        '#store-list', event);
    });
    $('#container_stores').children().click( (event) => {
      let store =
        $(event.target).closest($('a')).get(0).dataset.store;
      this.#excecuteHandler(
        handler, [store],
        '#product-list',
        { action: 'productsStoreList', store: store },
        '#store-list', event);
    });
  }

  bindProductsStoreCategoryList(handler, store) {
    this.categories.children().click((event) => {
      let category =
        $(event.target).closest($('a')).get(0).dataset.category;
      this.#excecuteHandler(
        handler, [store, category],
        '#product-list',
        { action: 'productsStoreCategoryList', store: store, category: category },
        '#store-category-list', event);
    });
  }

  bindProductsStoreCategoryTypeList(handler, store, category) {
    $('#type').change((event) => {
      let type =
        $(event.target).get(0).value;
      this.#excecuteHandler(
        handler, [type, store, category],
        '#product-list',
        { action: 'productsStoreCategoryTypeList', type: type, store: store, category: category},
        '#store-category-type-list', event);
      //Marcamos como sleccionado el tipo que hemos filtrado
      $('#type').val(type);
    });
  }

  bindShowProduct(handler) {
    $('#product-list').find('a.img-wrap').click((event) => {
      let serial = $(event.target).closest($('a')).get(0).dataset.serial;
      this.#excecuteHandler(handler, [serial],
        '#single-product',
        { action: 'showProduct', serial: serial },
        '#single-product',
        event);
    });
    $('#product-list').find('figcaption a').click((event) => {
      this.#excecuteHandler(
        handler,
        [event.target.dataset.serial],
        '#single-product',
        { action: 'showProduct', serial: event.target.dataset.serial },
        '#product-list',
        event);
    });
  }

  listProducts(products, title) {
    this.main.empty();
    let container = $(`<div id="product-list" class="container my-3"><div class="row row-cols-1 row-cols-md-3 g-4"> </div></div>`);
    for (let product of products) {
      let div = $(`
      <div class="col">
        <div class="card h-100">
          <a data-serial="${product.product.serialNumber}" href="#single-product" class="img-wrap"><img class="${product.product.constructor.name}-style card-img-top" src="img/${product.product.images}"></a>
          <div class="card-body">
            <h5 class="card-title"> <a data-serial="${product.product.serialNumber}" href="#single-product" class="title">${product.product.name}</a> </h5>
          </div>
          <div class="card-footer">
            <small class="text-muted price">${product.product.price}€</small>
          </div>
        </div>
      </div>
      `);
      container.children().first().append(div);
    }
    let header = $(`<header class="main__header"></header>`);
    header.append(`<h1>${title}</h1>`);
    header.append(`
    <select id="type">
      <option value=""></option>
      <option value="Processor">Procesadores</option>
      <option value="Graphic_Card">Tarjetas Gráficas</option>
      <option value="RAM">Memorias RAM</option>
    </select>
    `);
    this.main.append(header);
    this.main.append(container);
  }

  showProduct(product, message) {
    this.main.empty();
    let container;
    if (product) {
      container = $(`<div id="single-product" class="${product.product.constructor.name}-style container mt-5 mb-5">
				<div class="row d-flex justify-content-center">
					<div class="col-md-10">
						<div class="card">
							<div class="row">
								<div class="col-md-6">
									<div class="images p-3">
										<div class="text-center p-4"> <img id="main-image" src="img/${product.product.images}"/> </div>
									</div>
								</div>
								<div class="col-md-6">
									<div class="product p-4">
										<div class="mt-4 mb-3"> <span class="text-uppercase text-muted brand">${product.product.constructor.name}</span>
											<h5 class="text-uppercase">${product.product.name}</h5>
											<div class="price d-flex flex-row align-items-center">
												<span class="act-price">${product.product.price}€</span>
											</div>
										</div>
										<p class="about">${product.product.description}</p>
										<div class="sizes mt-5">
											<h6 class="text-uppercase">${product.product.tax}</h6>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`);

      container.find('h6').after(this.#instance[product.constructor.name]);

    } else {
      container = $(` <div class="container mt-5 mb-5">
				<div class="row d-flex justify-content-center">
					${message}
				</div>
			</div>`);
    }
    this.main.append(container);
  }


  #instance = {
    Processor: this.#ProcessorCharacteristics,
    Graphics_Card: this.#Graphics_CardCharacteristics,
    RAM: this.#RAMCharacteristics,
  }
  #ProcessorCharacteristics(product) {
    return $('<div>Características de Procesador.</div>');
  }
  #Graphics_CardCharacteristics(product) {
    return $('<div>Características de tarjeta gráfica.</div>');
  }
  #RAMCharacteristics(product) {
    return $('<div>Características de memoria RAM</div>');
  }






}

export default StoreHouseView;
