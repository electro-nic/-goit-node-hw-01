const chalk = require("chalk");
const { Command } = require("commander");
const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
} = require("./contact");

const program = new Command();
program
  .requiredOption("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case "list":
      const contacts = await listContacts();
      console.table(contacts);
      break;

    case "get":
      const contactById = await getContactById(id);
      if (contactById) {
        console.log(chalk.black.bgYellowBright.bold("Contact found"));
        console.table(contactById);
        return;
      } else {
        console.log(chalk.black.bgMagentaBright.bold("Contact not found"));
      }
      break;

    case "add":
      await addContact(name, email, phone);
      break;

    case "remove":
      const finalContacts = await removeContact(id);
      if (finalContacts) {
        console.table(finalContacts);
      }
      break;

    default:
      console.warn(chalk.bgRed.bold("Unknown action type!"));
  }
};

invokeAction(argv).then(() => console.log("Operation success"));
