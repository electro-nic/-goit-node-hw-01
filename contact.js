const chalk = require("chalk");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const readContent = async () => {
  const content = await fs.readFile(
    path.join(__dirname, "db", "contacts.json"),
    "utf8"
  );
  const result = JSON.parse(content);
  return result;
};

const listContacts = async () => {
  return await readContent();
};

const getContactById = async (contactId) => {
  const contacts = await readContent();
  const result = contacts.find((contact) => contact.id === contactId);
  return result;
};

const removeContact = async (contactId) => {
  const contacts = await readContent();
  const deletedContact = contacts.find((contact) => contact.id === contactId);

  if (!deletedContact) {
    console.log(
      chalk.bgRed.bold(
        `Contact with ID "${contactId}" don't removed! ID "${contactId}" not found!`
      )
    );
    return;
  }

  const finalList = contacts.filter((contact) => contact.id !== contactId);
  await fs.writeFile(
    path.join(__dirname, "db", "contacts.json"),
    JSON.stringify(finalList, null, 2)
  );
  console.table(deletedContact);
  console.log(
    chalk.bgGreen.bold(
      `Contact with ID "${contactId}" was removed succesfully!`
    )
  );
  return finalList;
};

const addContact = async (name, email, phone) => {
  const contacts = await readContent();
  const newContact = { name, email, phone, id: crypto.randomUUID() };

  if (newContact.name && newContact.phone && newContact.email) {
    console.log(chalk.bgGreen.bold(`Contact ${newContact.name} was added!`));
    console.table(newContact);
    return;
  } else {
    console.log(
      chalk.bgRedBright.bold(
        "To add contact enter, please, contact name, email and phone!"
      )
    );
  }

  contacts.push(newContact);
  await fs.writeFile(
    path.join(__dirname, "db", "contacts.json"),
    JSON.stringify(contacts, null, 2)
  );
  return newContact;
};

module.exports = { listContacts, getContactById, removeContact, addContact };
