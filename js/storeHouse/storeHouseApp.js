"use strict";
import StoreHouse from './storeHouseModel.js';
import {
  BaseException,
  InvalidAccessConstructorException,
  EmptyValueException,
  InvalidValueException,
  AbstractClassException,
  NotExistException,
  ExistException
} from './storeHouseModel.js';
import { Product, Processor, Graphic_Card, RAM } from './storeHouseModel.js';
import { Category } from './storeHouseModel.js';
import { StoreException, CoordsStoreException, Store, Coords } from './storeHouseModel.js';
import StoreHouseController from './storeHouseController.js';
import StoreHouseView from './storeHouseView.js';

$(function() {
  const StoreHouseApp = new StoreHouseController(
    StoreHouse.getInstance("Almacen"), new StoreHouseView()
  );
});

