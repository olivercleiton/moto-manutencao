const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'database.json');

// Inicializar arquivo de dados se não existir
if (!fs.existsSync(dataPath)) {
  const initialData = {
    users: [],
    vehicles: [],
    services: []
  };
  fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
}

const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], vehicles: [], services: [] };
  }
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Funções auxiliares
const getUsers = () => readData().users;
const saveUsers = (users) => {
  const data = readData();
  data.users = users;
  writeData(data);
};

const getVehicles = () => readData().vehicles;
const saveVehicles = (vehicles) => {
  const data = readData();
  data.vehicles = vehicles;
  writeData(data);
};

const getServices = () => readData().services;
const saveServices = (services) => {
  const data = readData();
  data.services = services;
  writeData(data);
};

module.exports = {
  getUsers,
  saveUsers,
  getVehicles,
  saveVehicles,
  getServices,
  saveServices
};