import Customer from '../models/customer.js';
import createHttpError from 'http-errors';

// 📌 Получить всех клиентов (GET)
export async function getAllCustomers(req, res, next) {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    next(createHttpError(500, 'Ошибка загрузки клиентов'));
  }
}

// 📌 Добавить нового клиента (POST)
export async function createCustomer(req, res, next) {
  try {
    const { name, email, address, phone } = req.body;
    const newCustomer = await Customer.create({ name, email, address, phone });
    res.status(201).json(newCustomer);
  } catch (error) {
    next(createHttpError(500, 'Ошибка добавления клиента'));
  }
}

// 📌 Обновить клиента (PUT)
export async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCustomer) throw createHttpError(404, 'Клиент не найден');
    res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
}

// 📌 Удалить клиента (DELETE)
export async function deleteCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) throw createHttpError(404, 'Клиент не найден');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
